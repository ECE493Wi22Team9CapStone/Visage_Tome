"""
    This file contains the model serializers for the posts app
    Related Functional Requirements:
    * Same as posts/models.py
"""

from datetime import timedelta
from .models import Post, Image, Video, Comment, Like
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class PostSerializer(ModelSerializer):
    images = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()

    def get_images(self, obj):
        images = Image.objects.filter(post__id=obj.id)
        return [image.image.url for image in images]

    def get_likes(self, obj):
        return Like.objects.filter(post__id=obj.id).count()

    def get_comments(self, obj):
        comments = Comment.objects.filter(post__id=obj.id).order_by('-date')
        return CommentSerializer(comments, many=True).data

    def get_video(self, obj):
        try:
            return Video.objects.get(post__id=obj.id).video.url
        except:
            return ""

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
            'video',
            'likes',
            'comments'
        ]

class CommentSerializer(ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = [
            'username',
            'content',
            'date'
        ]
