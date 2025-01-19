from django.db import models
from reg_log.models import UserProfile

class Animal(models.Model):
    SEX_CHOICES = [
        ('M', 'male'),
        ('F', 'female')
    ]
    STATUS_CHOICES = [
        ('adopted', 'Adopted'),
        ('available', 'Available'),
    ]

    photo = models.ImageField(upload_to='animals/')
    name = models.CharField(max_length=50)
    species = models.CharField(max_length=25)
    breed = models.CharField(max_length=25)
    age = models.IntegerField()
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