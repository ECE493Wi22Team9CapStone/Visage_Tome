"""
    This file contains all the endpoint specification for the posts app
    Related Functional Requirements: 
    * FR4 - Photo.Auto.Tagging
"""

from django.urls import path
from .views import *

urlpatterns = [
    path('', TaggingView.as_view(), name='tag-images'),
]