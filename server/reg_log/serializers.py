from rest_framework import serializers
from django.contrib.auth.models import User
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from .models import UserProfile, CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import connection

class UserNameSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = UserProfile
        fields = ['username']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role']

class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('adopter', 'Adopter'), ('shelter', 'Shelter')], write_only=True)

    class Meta:
        model = CustomUser  # Use CustomUser instead of User
        fields = ['email', 'username', 'password1', 'password2', 'role']

    def validate(self, data):
        # Check if passwords match
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        # Extract the role and passwords from validated_data
        role = validated_data.pop('role')
        password = validated_data.pop('password1')
        validated_data.pop('password2')

        # Create the user with plain text password
        user = CustomUser(**validated_data)
        user.password = password  # Store plain text password
        user.is_active = False  # Deactivate account until email confirmation
        user.save()

        # Create the UserProfile instance with the role
        UserProfile.objects.create(user=user, role=role)

        # Generate token
        token = default_token_generator.make_token(user)
        uid = user.pk

        # Generate activation link
        activation_link = f"http://localhost:5173/activate/{uid}/{token}/"

        # Send activation email
        send_mail(
            'Activate Your Account',
            f'Please click the link to activate your account: {activation_link}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return user