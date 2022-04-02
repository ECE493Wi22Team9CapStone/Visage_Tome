"""
    File is used by Django to register the "tagging" application
    Related Functional Requirements: None
"""

from django.apps import AppConfig

class TaggingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tagging'
