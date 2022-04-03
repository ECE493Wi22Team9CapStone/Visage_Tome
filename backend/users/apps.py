"""
    File is used by Django to register the "users" application
    Related Functional Requirements: None
"""

from django.apps import AppConfig

class PostsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
