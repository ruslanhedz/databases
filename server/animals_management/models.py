from django.db import models
from reg_log.models import UserProfile
import os
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings


def rename_photo(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.id}.{ext}" if instance.id else f"temp.{ext}"
    return os.path.join('images/', filename)

class Animal(models.Model):
    SEX_CHOICES = [
        ('M', 'male'),
        ('F', 'female')
    ]
    STATUS_CHOICES = [
        ('adopted', 'Adopted'),
        ('available', 'Available'),
    ]

    photo = models.ImageField(upload_to=rename_photo)
    name = models.CharField(max_length=50)
    species = models.CharField(max_length=25)
    breed = models.CharField(max_length=25)
    age = models.IntegerField(default=0)
    sex = models.CharField(max_length=7, choices=SEX_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    shelterId = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'shelter'},
        related_name='animals'
    )

    def __str__(self):
        return f"{self.name} ({self.species})"


@receiver(post_save, sender=Animal)
def rename_photo_on_save(sender, instance, created, **kwargs):
    if created and instance.photo:
        ext = instance.photo.name.split('.')[-1]
        new_filename = f"{instance.id}.{ext}"
        new_path = os.path.join('images/', new_filename)
        old_path = instance.photo.path
        new_full_path = os.path.join(settings.MEDIA_ROOT, new_path)

        if old_path != new_full_path:
            os.rename(old_path, new_full_path)
            instance.photo.name = new_path
            instance.save(update_fields=['photo'])

class Adoptions(models.Model):
    AnimalId = models.ForeignKey(Animal, on_delete=models.CASCADE)
    AdopterId = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'adopter'},
        related_name='adoptions'
    )
    AdoptionDate = models.DateField
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected')
        ],
        default='pending'
    )