from django.utils import timezone

from .models import User
from .serializers import UserSerializer

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions, exceptions

import uuid
import bcrypt
from rest_framework.authtoken.models import Token

class UserView(APIView):
    serializer_class = UserSerializer

    # login
    def post(self, request):
        data = request.data

        expectedFields = ['username', 'password']
        if not all(field in expectedFields for field in data):
            return Response("Missing fields", status=status.HTTP_400_BAD_REQUEST)

        # grab user
        try:
            user = User.objects.get(username=data['username'])
            if user.bantime > timezone.now():
                return Response("This account is banned", status=status.HTTP_401_UNAUTHORIZED)

        # user = UserSerializer(user)
        except User.DoesNotExist:
            return Response("User doesn't exist", status=status.HTTP_400_BAD_REQUEST)

        pwd = user.password
        enc_pwd = bcrypt.hashpw(data['password'].encode("utf-8"), bcrypt.gensalt())
        if bcrypt.checkpw(pwd.encode("utf-8"), enc_pwd):
            return Response("Invalid Password", status=status.HTTP_400_BAD_REQUEST)

        token = Token.objects.get_or_create(user=user)[0]
        res = {"msg": "login success", "token": token.key, "admin": user.is_superuser}
        return Response(res, status=status.HTTP_200_OK)

    # patch changes user info
    # to ban a user we change their
    def patch(self, request):
        try:
            user = User.objects.get(username=request.data['username'])
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response("Successful update {}".format(request.data), status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response("User doesn't exist", status=status.HTTP_400_BAD_REQUEST)

        return Response("Invalid request", status=status.HTTP_400_BAD_REQUEST)


class UserSignupView(APIView):
    serializer_class = UserSerializer

    def get(self, request):
        return Response("wrong", status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        # validate fields
        tmp_serializer = UserSerializer(data=data)
        if not tmp_serializer.is_valid():
            return Response(tmp_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            pwd = data['password'].encode('utf-8')
            enc_pwd = bcrypt.hashpw(pwd, bcrypt.gensalt()).decode('utf-8')
            user = {"password": enc_pwd, "username": data['username']}
            serializer = UserSerializer(data=user)
            if serializer.is_valid():
                user = serializer.save()
                token = Token.objects.create(user=user)
                return Response({"msg": "success, created user {}".format(user.username), "token": token.key}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response("User with username already exists", status=status.HTTP_409_CONFLICT)
