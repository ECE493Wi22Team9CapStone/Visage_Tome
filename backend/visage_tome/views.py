from rest_framework.response import Response
from rest_framework import status

from .models import models, EditableSetting

from rest_framework.views import APIView

from .serializers import EditableSettingSerializer


class VisageTomeAPIView(APIView):

    def patch(self, request):
        data = request.data
        lifespan_params = EditableSetting.load()
        print(data)
        if data.get('guest_post_lifespan', False):
            lifespan_params.guest_post_lifespan = data['guest_post_lifespan']
        if data.get('user_post_lifespan', False):
            lifespan_params.user_post_lifespan = data['user_post_lifespan']
        if data.get('like_lifespan_add', False):
            lifespan_params.like_lifespan_add = data['like_lifespan_add']

        lifespan_params.save()
        return Response(data, status=status.HTTP_200_OK)

    def get(self, request):
        lifespan_params = EditableSetting.load()
        settings = EditableSettingSerializer(lifespan_params)
        res = settings.data
        return Response(res, status=status.HTTP_200_OK)
