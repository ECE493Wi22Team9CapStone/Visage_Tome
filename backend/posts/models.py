"""
    This file contains the models for the posts app
    Related Functional Requirements:
    * FR3 - Create.Post
    * FR5 - Remove.Post
    * FR6 - Post.LifeSpan
    * FR7 - Change.LifeSpan
    * FR8 - View.Posts
    * FR9 - Search.Post
    * FR11 - Like.Posts
    * FR12 - Comment.Posts
"""

import uuid
from django.db import models
from users.models import User

class Post(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=100, default=uuid.uuid4)
    display_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date_posted = models.DateTimeField(auto_now_add=True)
    date_expiry = models.DateTimeField(null=True, blank=True)
    tags = models.CharField(max_length=400, default="")

    def __str__(self):
        return "(" + self.id + ") " + self.title

class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_images")
    image = models.ImageField(upload_to='images/')

class Video(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_videos")
    video = models.FileField(upload_to='videos/')

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_likes", null=True)
    date = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments", null=True)
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()