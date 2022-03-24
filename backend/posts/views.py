from datetime import timedelta
from visage_tome.models import EditableSetting
from .models import Post, Image, Like, Comment
from .serializers import CommentSerializer, PostSerializer
from .pagination import PostPagination

from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions, exceptions

import uuid

class PostListView(ListCreateAPIView):
    serializer_class = PostSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        return Post.objects.filter(date_expiry__gt=timezone.now()).order_by('-date_posted')

    def get(self, request, *args, **kwargs):
        """
        ## Description:
        Get all posts, paginated 
        ## Responses:
        **200**: for successful GET request, paginated posts are returned <br>
        """
        return super().list(request, *args, **kwargs)

    def post(self, request):
        post_id = uuid.uuid4()
        return PostDetailView().post(request, post_id)

class PostDetailView(APIView):
    serializer_class = PostSerializer

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

    def post(self, request, post_id):
        """
        ## Description:
        create a new post with the id post_id
        ## Responses:
        **200**: for successful POST request, the post JSON is returned <br>
        **400**: if the payload failed the serializer check <br>
        **409**: if the post_id already exist
        """
        try:
            post = Post.objects.get(id=post_id)
            return Response("Post id already exist", status=status.HTTP_409_CONFLICT)
        except Post.DoesNotExist:
            if "images" not in request.data:
                return Response("Post does not include 'images' field", status=status.HTTP_400_BAD_REQUEST)
            serializer = PostSerializer(data=request.data)
            if serializer.is_valid():
                post = serializer.save()
                for image in request.data.getlist("images"):
                    Image.objects.create(post=post, image=image)
                settings = EditableSetting.load()
                try:
                    # TODO: add condition for registered user
                    post.date_expiry = post.date_posted + timedelta(days=settings.guest_post_lifespan)
                except EditableSetting.DoesNotExist:
                    post.date_expiry = post.date_posted + timedelta(days=7)
                post.save()

                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        pass

class PostLikeView(APIView):
    def post(self, request, post_id):
        """
        ## Description:
        Like the post with the id post_id
        ## Responses:
        **200**: for successful POST request, the post JSON is returned <br>
        **404**: if the post_id does not exist
        """
        try:
            post = Post.objects.get(id=post_id)
            like = Like.objects.create(post=post)

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
    serializer_class = CommentSerializer

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
                comment = Comment.objects.create(post=post, **serializer.validated_data)
                comment.save()
                return Response(PostSerializer(post).data)
        except Post.DoesNotExist:
            return Response("Post id does not exist", status=status.HTTP_404_NOT_FOUND)