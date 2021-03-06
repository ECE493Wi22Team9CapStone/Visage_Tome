"""
    This file contains all the endpoint logic for the posts app
    Related Functional Requirements:
    * FR3 - Create.Post
    * FR5 - Remove.Post
    * FR8 - View.Posts
    * FR9 - Search.Post
    * FR11 - Like.Posts
    * FR12 - Comment.Posts
    individual relation is also specified in the comment for each function
"""

from datetime import timedelta
from visage_tome.models import EditableSetting
from .models import Post, Image, Video, Like, Comment
from .serializers import CommentSerializer, PostSerializer
from .pagination import PostPagination

from django.utils import timezone
from django.db.models import Q
from django.contrib.auth.models import AnonymousUser

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions, exceptions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication

import uuid

class PostListView(ListCreateAPIView):
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        queryset = Post.objects.filter(date_expiry__gt=timezone.now()).order_by('-date_posted')
        search = self.request.query_params.get('search', None)

        if search is not None and len(search) > 0:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(display_name__icontains=search) |
                Q(tags__icontains=search)
            )

        return queryset

    # FR8 - View.Posts, FR9 - Search.Post
    def get(self, request, *args, **kwargs):
        """
        ## Description:
        Get all posts, paginated 
        ## Responses:
        **200**: for successful GET request, paginated posts are returned <br>
        """
        return super().list(request, *args, **kwargs)

    # FR3 - Create.Post
    def post(self, request):
        """
        ## Description:
        create a new post
        ## Responses:
        **200**: for successful POST request, the post JSON is returned <br>
        **400**: if the payload failed the serializer check
        """
        if "images" not in request.data:
            return Response("Post does not include 'images' field", status=status.HTTP_400_BAD_REQUEST)
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save()
            for image in request.data.getlist("images"):
                Image.objects.create(post=post, image=image)
            if "video" in request.data:
                Video.objects.create(post=post, video=request.data["video"])
            settings = EditableSetting.load()
            try:
                if isinstance(request.user, AnonymousUser):
                    post.date_expiry = post.date_posted + timedelta(days=settings.guest_post_lifespan)
                else:
                    post.date_expiry = post.date_posted + timedelta(days=settings.user_post_lifespan)
            except EditableSetting.DoesNotExist:
                post.date_expiry = post.date_posted + timedelta(days=7)
            post.save()

            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetailView(APIView):
    serializer_class = PostSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    # FR5 - Remove.Post, FR11 - Like.Posts, FR12 - Comment.Posts
    def get(self, request, post_id):
        """
        ## Description:
        Get the post with the id post_id
        ## Responses:
        **200**: for successful GET request, the post JSON is returned <br>
        **404**: if the post_id does not exist
        """
        try:
            post = Post.objects.get(id=post_id)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response("Post id does not exist", status=status.HTTP_404_NOT_FOUND)

    # FR5 - Remove.Post
    def delete(self, request, post_id):
        """
        ## Description:
        delete the post with the id post_id
        ## Responses:
        **204**: for successful DELETE request <br>
        **404**: if the post_id does not exist
        """
        if not request.user.is_superuser:
            return Response("Only admin can delete posts", status=status.HTTP_403_FORBIDDEN)

        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response("Post id does not exist", status=status.HTTP_404_NOT_FOUND)

class PostLikeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # FR11 - Like.Posts
    def get(self, request, post_id):
        """
        ## Description:
        This endpoint will not return the number of likes <br>
        Instead this returns whether the user has liked the post or not
        ## Responses:
        **200**: returns whether the user has liked the post or not <br>
        **404**: if the post_id does not exist
        """
        try:
            post = Post.objects.get(id=post_id)
            like = Like.objects.filter(post=post, user=request.user)
            return Response({"liked":like.exists()}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response("Post id does not exist", status=status.HTTP_404_NOT_FOUND)

    # FR11 - Like.Posts
    def post(self, request, post_id):
        """
        ## Description:
        Like the post with the id post_id
        ## Responses:
        **200**: for successful POST request, the post JSON is returned <br>
        **404**: if the post_id does not exist <br>
        **409**: if the user has already liked the post
        """
        try:
            post = Post.objects.get(id=post_id)
            like, created = Like.objects.get_or_create(post=post, user=request.user)
            if not created:
                return Response("User already liked this post", status=status.HTTP_409_CONFLICT)

            settings = EditableSetting.load()
            try:
                lifespan_add_time = settings.like_lifespan_add
            except EditableSetting.DoesNotExist:
                lifespan_add_time = 1
            post.date_expiry = post.date_expiry + timedelta(days=lifespan_add_time)
            post.save()
            return Response(PostSerializer(post).data)

        except Post.DoesNotExist:
            return Response("Post id does not exist", status=status.HTTP_404_NOT_FOUND)

class PostCommentView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    # FR12 - Comment.Posts
    def post(self, request, post_id):
        """
        ## Description:
        Comment on the post with the id post_id
        ## Responses:
        **200**: for successful POST request, the post JSON is returned <br>
        **400**: if the payload failed the serializer check <br>
        **404**: if the post_id does not exist
        """
        try:
            post = Post.objects.get(id=post_id)
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                comment = Comment.objects.create(post=post, user=request.user, **serializer.validated_data)
                comment.save()
                return Response(PostSerializer(post).data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response("Post id does not exist", status=status.HTTP_404_NOT_FOUND)