"""
    This file contains all the endpoint logic for the tagging app
    Related Functional Requirements:
    * FR4 - Photo.Auto.Tagging
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TagImage
from .AITagger import AITagger

tagger = AITagger()

class TaggingView(APIView):
    def post(self, request):
        if "images" not in request.data:
            return Response("Post does not include 'images' field", status=status.HTTP_400_BAD_REQUEST)
        # Save the images temporarily so we can tag them
        for image in request.data.getlist("images"):
            TagImage.objects.create(image=image)
        # Call the AI to tag the images
        tagList = tagger.tag()
        # Delete the images objects from database
        TagImage.objects.all().delete()
        return Response(tagList)
