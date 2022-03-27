from django.urls import path
from .views import *

urlpatterns = [
    path('', PostListView.as_view(), name='post-list'),
    path('<str:post_id>/', PostDetailView.as_view(), name='post-detail'),
    path('<str:post_id>/like/', PostLikeView.as_view(), name='post-like'),
    path('<str:post_id>/comment/', PostCommentView.as_view(), name='post-comment'),
]