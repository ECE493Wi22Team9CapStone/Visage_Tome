from .models import Post
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
        pass

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
            serializer = PostSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        pass
