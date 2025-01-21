from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from reg_log.models import UserProfile
from .models import Animal, Adoptions
from .serializers import AnimalSerializer, AnimalListSerializer, AdoptionsSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import date
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        animals = Animal.objects.filter(shelterId=request.user.id)
        serializer = AnimalListSerializer(animals, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateAdoptionRequestView(APIView):
    def post(self, request):
        adopter = UserProfile.objects.get(user=request.user, role='adopter')  # Ensure the user is an adopter
        Animal_data = {
            'AnimalId': request.data['animal_id'],
            'AdopterId': request.user.id,
            'AdoptionDate': date.today(),
            'status':'pending',
        }   # Assign AdopterId to the current user

        # Ensure the animal exists and is available
        animal_id = Animal_data.get('AnimalId')
        try:
            animal = Animal.objects.get(id=animal_id, status='available')
        except Animal.DoesNotExist:
            return Response({"error": "Animal is not available for adoption."}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent duplicate adoptions
        if Adoptions.objects.filter(AnimalId=animal_id, AdopterId=adopter).exists():
            return Response({"error": "You have already adopted this animal."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdoptionsSerializer(data=Animal_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the current user's shelter profile
            shelter_profile = UserProfile.objects.get(user=request.user)

            # Ensure the user is a shelter
            if shelter_profile.role != 'shelter':
                return Response({"error": "You are not authorized to view adoption requests."},
                                status=status.HTTP_403_FORBIDDEN)

            # Get animals belonging to this shelter
            shelter_animals = Animal.objects.filter(shelterId=shelter_profile.user.id)

            # Get adoption requests for those animals
            adoption_requests = Adoptions.objects.filter(AnimalId__in=shelter_animals)

            # Prepare custom data structure for the response
            result = []
            for Request in adoption_requests:
                result.append({
                    'adoption_id': Request.id,
                    'adopter_name': Request.AdopterId.user.username,  # Assuming the adopter name is stored in UserProfile
                    'animal_id': Request.AnimalId.id,
                    'animal_name': Request.AnimalId.name,
                    'adoption_date': Request.AdoptionDate,
                    'status': Request.status,
                })

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MyAdoptionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            adopter_profile = UserProfile.objects.get(user=request.user)

            if adopter_profile.role != 'adopter':
                return Response({"error": "You are not authorized to view adoption requests."},
                                status=status.HTTP_403_FORBIDDEN)

            adoption_requests = Adoptions.objects.filter(AdopterId=adopter_profile)

            # Prepare custom data structure for the response
            result = []
            for Request in adoption_requests:
                result.append({
                    'adoption_id': Request.id,
                    'adopter_name': Request.AdopterId.user.username,
                    # Assuming the adopter name is stored in UserProfile
                    'animal_id': Request.AnimalId.id,
                    'animal_name': Request.AnimalId.name,
                    'adoption_date': Request.AdoptionDate,
                    'status': Request.status,
                })

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApproveAdoptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            adoption = Adoptions.objects.get(id=request.data.get('adoption_id'))
            animal = adoption.AnimalId

            if animal.shelterId.user.id != request.user.id:
                return Response({"error": "This is not your animal hacker!"},
                            status=status.HTTP_403_FORBIDDEN)

            if animal.status == 'adopted':
                return Response({"error": "Animal is already adopted."},
                            status=status.HTTP_400_BAD_REQUEST)
            print('Im here')
            adoption.status = 'approved'
            animal.status = 'adopted'
            adoption.save()
            animal.save()

            Adoptions.objects.filter(AnimalId=animal).exclude(id=adoption.id).update(status='rejected')

            return Response(
                    {"message": "Adoption request approved. Other requests rejected, and animal status updated to 'adopted'."},
                        status=status.HTTP_200_OK
                    )

        except Adoptions.DoesNotExist:
            return Response({"error": "Adoption request not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RejectAdoptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            adoption = Adoptions.objects.get(id=request.data.get('adoption_id'))
            animal = adoption.AnimalId

            if animal.shelterId.user.id != request.user.id:
                return Response({"error": "This is not your animal hacker!"},
                            status=status.HTTP_403_FORBIDDEN)

            print('Im here')
            adoption.status = 'rejected'

            adoption.save()

            return Response(
                    {"message": "Adoption request rejected."},
                        status=status.HTTP_200_OK
                    )

        except Adoptions.DoesNotExist:
            return Response({"error": "Adoption request not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)