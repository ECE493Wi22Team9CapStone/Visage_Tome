from .models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'bantime',
        ]
