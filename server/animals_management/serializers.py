from rest_framework import serializers
from .models import Animal, Adoptions

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = '__all__'


class AdoptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adoptions
        fields = '__all__'
