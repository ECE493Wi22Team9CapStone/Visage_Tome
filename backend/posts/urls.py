from django.urls import path
from .views import *

urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('<str:post_id>/', PostDetailView.as_view(), name='post-detail'),
]