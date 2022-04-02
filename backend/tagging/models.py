"""
    File is contains the model for the tagging app
    Related Functional Requirements:
    * FR4 - Photo.Auto.Tagging
"""

from django.db import models

# a simple model to temporarily store the image for tagging
class TagImage(models.Model):
    image = models.ImageField(upload_to='tag_images/')
