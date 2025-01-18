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
from .models import UserProfile
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
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

class LogOutView(APIView):
    def post(self, request):
        response = JsonResponse({'message': 'Logged out successfully'})
        return response