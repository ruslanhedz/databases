from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('adopter', 'Adopter'),
        ('shelter', 'Shelter'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='adopter')

    def __str__(self):
        return self.user.username