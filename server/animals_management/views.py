from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from reg_log.models import UserProfile
from .models import Animal, Adoptions
from .serializers import AnimalSerializer, AnimalListSerializer, AdoptionsSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required


class AddAnimalAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # For handling file uploads

    def post(self, request, *args, **kwargs):
        # Extract the UserProfile associated with the authenticated user
        user_profile = UserProfile.objects.get(user=request.user)  # Assuming 'profile' is related to the user

        # Include user_profile in the request data
        animal_data = request.data.copy()  # Copy the data so we can modify it
        animal_data['shelterId'] = request.user.id  # Set shelterId to the UserProfile ID

        # Create the serializer with the updated data
        serializer = AnimalSerializer(data=animal_data)

        if serializer.is_valid():
            serializer.save()  # Save without needing to manually set shelterId
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Add this line to log the errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If validation fails, return error details
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvailableAnimalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        animals = Animal.objects.filter(status='available')
        serializer = AnimalListSerializer(animals, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class MyAnimalsView(APIView):
    def get(self, request):
        animals = Animal.objects.filter(shelterId=request.user.id)
        serializer = AnimalSerializer(animals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateAdoptionRequestView(APIView):
    def post(self, request):
        adopter = UserProfile.objects.get(user=request.user, role='adopter')  # Ensure the user is an adopter
        request_data = request.data.copy()
        request_data['AdopterId'] = adopter.id  # Assign AdopterId to the current user

        # Ensure the animal exists and is available
        animal_id = request_data.get('AnimalId')
        try:
            animal = Animal.objects.get(id=animal_id, status='available')
        except Animal.DoesNotExist:
            return Response({"error": "Animal is not available for adoption."}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicate adoptions
        if Adoptions.objects.filter(AnimalId=animal_id, AdopterId=adopter).exists():
            return Response({"error": "You have already adopted this animal."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdoptionsSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the current user's shelter profile
            shelter_profile = request.user.userprofile

            # Ensure the user is a shelter
            if shelter_profile.role != 'shelter':
                return Response({"error": "You are not authorized to view adoption requests."},
                                status=status.HTTP_403_FORBIDDEN)

            # Get animals belonging to this shelter
            shelter_animals = Animal.objects.filter(shelterId=shelter_profile)

            # Get adoption requests for those animals
            adoption_requests = Adoptions.objects.filter(AnimalId__in=shelter_animals)

            # Prepare custom data structure for the response
            result = []
            for request in adoption_requests:
                result.append({
                    'adoption_id': request.id,
                    'adopter_name': request.AdopterId.name,  # Assuming the adopter name is stored in UserProfile
                    'animal_id': request.AnimalId.id,
                    'animal_name': request.AnimalId.name,  # Assuming animal name is a field in Animal model
                    'status': request.status,
                })

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MyAdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            adopter_profile = request.user.userprofile
            if adopter_profile.role != 'adopter':
                return Response({"error": "Shelters don't adopt animals"},
                                status=status.HTTP_403_FORBIDDEN)

            adoption_requests = Adoptions.objects.filter(AdopterId=adopter_profile)

            # Prepare custom data structure for the response
            result = []
            for request in adoption_requests:
                result.append({
                    'adoption_id': request.id,
                    'shelter_name': request.AnimalId.shelterId.user.username, # Assuming the adopter name is stored in UserProfile
                    'animal_id': request.AnimalId.id,
                    'animal_name': request.AnimalId.name,  # Assuming animal name is a field in Animal model
                    'status': request.status,
                })

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApproveAdoptionRequestView(APIView):
    def post(self, request, adoption_id):
        try:
            # Get the adoption request to be approved
            adoption_request = Adoptions.objects.get(id=adoption_id)

            # Check if the animal is already adopted
            animal = adoption_request.AnimalId
            if animal.status == 'adopted':
                return Response({"error": "This animal has already been adopted."}, status=status.HTTP_400_BAD_REQUEST)

            # Approve the selected adoption request
            adoption_request.status = 'approved'
            adoption_request.save()

            # Reject all other requests for the same animal
            Adoptions.objects.filter(AnimalId=animal).exclude(id=adoption_request.id).update(status='rejected')

            # Update the animal's status to 'adopted'
            animal.status = 'adopted'
            animal.save()

            return Response(
                {"message": "Adoption request approved. Other requests rejected, and animal status updated to 'adopted'."},
                status=status.HTTP_200_OK
            )

        except Adoptions.DoesNotExist:
            return Response({"error": "Adoption request not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
