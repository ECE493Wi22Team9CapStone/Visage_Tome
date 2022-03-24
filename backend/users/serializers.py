from .models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
    # def create(self, validated_data):
    #     images = validated_data.pop('images')
    #     post = Post.objects.create(**validated_data)
    #     for image in images:
    #         Image.objects.create(post=post, image=image)
    #     return post

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'isbanned',
        ]
