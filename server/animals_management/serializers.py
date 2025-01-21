from rest_framework import serializers
from .models import Animal, Adoptions
from reg_log.serializers import UserNameSerializer

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = '__all__'


class AnimalListSerializer(serializers.ModelSerializer):
    shelter_username = serializers.SerializerMethodField()

    class Meta:
        model = Animal
        fields = ['id', 'name', 'species', 'breed', 'age', 'sex', 'description', 'photo', 'status', 'shelter_username']  # Add shelter_username to fields

    def get_shelter_username(self, obj):
        return obj.shelterId.user.username if obj.shelterId else None  # Fetch the username from the related UserProfile


class AdoptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adoptions
        fields = '__all__'
