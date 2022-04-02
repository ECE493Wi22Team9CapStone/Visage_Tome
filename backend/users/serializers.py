"""
    This file contains the model serializers for the users app
    Related Functional Requirements:
    * Same as posts/models.py
"""

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
