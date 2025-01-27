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
from flask import Flask, request, jsonify
import sqlite3
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import subprocess


app = Flask(__name__)

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

@csrf_exempt
def vulnerable_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Vulnerable raw SQL query
        query = f"SELECT * FROM auth_user WHERE username = '{username}' AND password = '{password}'"
        cursor = connection.cursor()
        cursor.execute(query)
        #cursor.execute(query, [username, password])
        user = cursor.fetchone()  # Fetch one result

        if user:
            user_obj = User.objects.get(id=user[0])  # Get the User object from the ID
            refresh = RefreshToken.for_user(user_obj)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

# class VulnerableLoginView(APIView):
#     serializer_class = MyTokenObtainPairSerializer
#
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
#         # Add custom claims
#         token['username'] = user.username
#         return token
#
# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer

class LogOutView(APIView):
    def post(self, request):
        response = JsonResponse({'message': 'Logged out successfully'})
        return response