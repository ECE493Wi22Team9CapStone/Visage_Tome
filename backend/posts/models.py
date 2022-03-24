import uuid
from django.db import models

# Create your models here.
class Post(models.Model):
    id = models.CharField(primary_key=True, editable=False, max_length=100, default=uuid.uuid4)
    display_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    tags = models.CharField(max_length=200, default="")
    #TODO: media field (Photo/Video)

    def __str__(self):
        return "(" + self.id + ") " + self.title

class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_images")
    image = models.ImageField(upload_to='images/')
