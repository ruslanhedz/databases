from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import pre_save
from django.dispatch import receiver
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


# Overriding the User model to store password in plain text
class CustomUser(User):
    def save(self, *args, **kwargs):
        if self.password:
            # Bypass password hashing - store as plain text
            self._password = self.password  # Save password as is (plain text)
            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)