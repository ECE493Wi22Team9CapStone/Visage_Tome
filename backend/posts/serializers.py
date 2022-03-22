from datetime import timedelta
from .models import Post, Image
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from visage_tome.models import EditableSetting

class PostSerializer(ModelSerializer):
    images = serializers.SerializerMethodField()

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
            'date_expiry',
            'tags',
            'images'
        ]