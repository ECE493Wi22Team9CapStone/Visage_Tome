from .models import Post, Image
from .serializers import PostSerializer

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions, exceptions

import uuid

class PostListView(ListCreateAPIView):
    serializer_class = PostSerializer

    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

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
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        pass
