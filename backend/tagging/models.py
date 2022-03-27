from django.db import models


class TagImage(models.Model):
    image = models.ImageField(upload_to='tag_images/')
