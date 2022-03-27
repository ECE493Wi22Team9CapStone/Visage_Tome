from django.urls import path
from .views import *

urlpatterns = [
    path('', TaggingView.as_view(), name='tag-images'),
]