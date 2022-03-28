from .models import EditableSetting
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class EditableSettingSerializer(ModelSerializer):
    class Meta:
        model = EditableSetting
        fields = [
            'guest_post_lifespan',
            'user_post_lifespan',
            'like_lifespan_add',
        ]
