"""
    File is used by Django to register the models to the Django admin site.
    Related Functional Requirements: None
"""

from django.contrib import admin
from .models import EditableSetting

admin.site.register(EditableSetting)