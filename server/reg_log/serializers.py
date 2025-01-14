from rest_framework import serializers
from django.contrib.auth.models import User
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password1'])
        user.is_active = False  # Deactivate account until it is confirmed
        user.save()

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