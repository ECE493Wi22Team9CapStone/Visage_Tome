from django.shortcuts import render
from datetime import timedelta
from visage_tome.models import EditableSetting

from django.utils import timezone
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions, exceptions
from .models import TagImage
from .tags import tagImages

import uuid

class TaggingView(APIView):
    def post(self, request):
        if "images" not in request.data:
            return Response("Post does not include 'images' field", status=status.HTTP_400_BAD_REQUEST)
        for image in request.data.getlist("images"):
            TagImage.objects.create(image=image)
        tagList = tagImages()
        return Response(tagList)
