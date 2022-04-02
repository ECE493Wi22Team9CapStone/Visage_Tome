"""
    File is used by Django to register the models to the Django admin site.
    Related Functional Requirements: None
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class CustomUserAdmin(UserAdmin):
    fieldsets = (
        *UserAdmin.fieldsets,  # original form fieldsets
        (                      
            'Ban Time',
            {
                'fields': (
                    'bantime',
                ),
            },
        ),
    )

# register
admin.site.register(User, CustomUserAdmin)
