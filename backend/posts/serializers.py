from .models import Post, Image
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class PostSerializer(ModelSerializer):
    images = serializers.SerializerMethodField()

    # def create(self, validated_data):
    #     images = validated_data.pop('images')
    #     post = Post.objects.create(**validated_data)
    #     for image in images:
    #         Image.objects.create(post=post, image=image)
    #     return post

    def get_images(self, obj):
        images = Image.objects.filter(post__id=obj.id)
        return [image.image.url for image in images]

    class Meta:
        model = Post
        fields = [
            'id', 
            'display_name', 
            'title', 
            'description', 
            'date_posted',
            'tags',
            'images'
        ]