"""
    File is used by Django to register the models to the Django admin site.
    Related Functional Requirements: None
"""

from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Post)
admin.site.register(Image)
admin.site.register(Like)
admin.site.register(Comment)
