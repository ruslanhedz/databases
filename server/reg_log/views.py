from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from .serializers import RegisterSerializer
from .tokens import account_activation_token
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from rest_framework import generics
from django.shortcuts import get_object_or_404


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

def activate_account(request, uid, token):
    user = get_object_or_404(User, pk=uid)
    user.is_active = True
    user.save()

    return HttpResponse('Your account is activated! Good luck and love animals!')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
# class SignUpView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         email = request.data.get('email')
#         password = request.data.get('password')
#
#         user = User(username=username, email=email, is_active=False)
#         user.set_password(password)
#         user.save()
#
#         # Send activation email
#         current_site = get_current_site(request)
#         subject = 'Activate Your Account'
#         message = f"""
#         Hi {user.username},
#         Please activate your account by clicking the link below:
#         http://{current_site.domain}/activate/{urlsafe_base64_encode(force_bytes(user.pk))}/{account_activation_token.make_token(user)}
#         """
#         send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
#
#         return Response({'message': 'Account created! Check your email to activate your account.'}, status=status.HTTP_201_CREATED)
#
# class ActivateAccountView(APIView):
#     def get(self, request, uidb64, token):
#         try:
#             uid = force_str(urlsafe_base64_decode(uidb64))
#             user = User.objects.get(pk=uid)
#         except (TypeError, ValueError, OverflowError, User.DoesNotExist):
#             return Response({'error': 'Invalid activation link.'}, status=status.HTTP_400_BAD_REQUEST)
#
#         if account_activation_token.check_token(user, token):
#             user.is_active = True
#             user.save()
#             return Response({'message': 'Account activated successfully!'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Invalid activation link.'}, status=status.HTTP_400_BAD_REQUEST)

# class LoginView(APIView):
#     def post(self, request):
#         from django.contrib.auth import authenticate
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(username=username, password=password)
#
#         if user is not None:
#             if not user.is_active:
#                 return Response({'error': 'Account not activated.'}, status=status.HTTP_403_FORBIDDEN)
#
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             })
#         return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogOutView(APIView):
    def post(self, request):
        response = JsonResponse({'message': 'Logged out successfully'})
        return response