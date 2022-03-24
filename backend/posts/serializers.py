from datetime import timedelta
from .models import Post, Image, Comment, Like
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from visage_tome.models import EditableSetting

class PostSerializer(ModelSerializer):
    images = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    def get_images(self, obj):
        images = Image.objects.filter(post__id=obj.id)
        return [image.image.url for image in images]

    def get_likes(self, obj):
        return Like.objects.filter(post__id=obj.id).count()

    def get_comments(self, obj):
        comments = Comment.objects.filter(post__id=obj.id)
        return CommentSerializer(comments, many=True).data

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
            'images',
            'likes',
            'comments'
        ]

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'username',
            'content',
            'date'
        ]