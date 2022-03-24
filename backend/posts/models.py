import uuid
from django.db import models

# Create your models here.
class Post(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=100, default=uuid.uuid4)
    display_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    date_expiry = models.DateTimeField(null=True, blank=True)
    tags = models.CharField(max_length=200, default="")
    #TODO: add video field

    def __str__(self):
        return "(" + self.id + ") " + self.title

class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_images")
    image = models.ImageField(upload_to='')

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_likes")
    # TODO: uncomment
    # user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name="user_likes")
    date = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comments")
    username = models.CharField(max_length=100, default="Anonymous")
    date = models.DateTimeField(auto_now_add=True)
    content = models.TextField()