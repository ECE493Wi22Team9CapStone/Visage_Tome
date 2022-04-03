"""
    This file contains all the endpoint logic for the users app
    Related Functional Requirements:
    * FR1 - User.Registration
    * FR2 - User.Login
    * FR10 - Ban.User
    individual relation is also specified in the comment for each function
"""

import dateutil.parser

from django.contrib.auth.hashers import check_password
from django.utils import timezone

from .models import User
from .serializers import UserSerializer

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status, permissions, exceptions

from rest_framework.authtoken.models import Token


class UserView(APIView):
    serializer_class = UserSerializer

    # FR2 - User.Login
    def post(self, request):
        """
        ## Description:
        endpoint for user login
        ## Responses:
        **200**: successful request, user token is returned <br>
        **400**: if the payload is missing te required fields <br>
        **401**: if the user is banned by the admin <br>
        """
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

        if not check_password(data['password'], user.password):
            return Response("Invalid Password", status=status.HTTP_400_BAD_REQUEST)

        token = Token.objects.get_or_create(user=user)[0]
        res = {"msg": "login success", "token": token.key, "admin": user.is_superuser}
        return Response(res, status=status.HTTP_200_OK)

    # FR10 - Ban.User
    # only allowed to patch for banId
    def patch(self, request):
        """
        ## Description:
        endpoint for administrator banning a user
        ## Responses:
        **200**: successful request <br>
        **400**: if the user does not exist or request is invalid <br>
        """
        bantime = timezone.now()
        if request.data.get('bantime', ''):
            bantime = dateutil.parser.isoparse(request.data['bantime'])

        try:
            bantime = {"bantime": bantime}
            user = User.objects.get(username=request.data['username'])
            serializer = UserSerializer(user, data=bantime, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response("Successful update {}".format(request.data), status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response("User doesn't exist", status=status.HTTP_400_BAD_REQUEST)

        return Response("Invalid request", status=status.HTTP_400_BAD_REQUEST)


class UserSignupView(APIView):
    serializer_class = UserSerializer

    # FR1 - User.Registration
    def post(self, request):
        """
        ## Description:
        endpoint for user registration
        ## Responses:
        **200**: successful request, user token is returned <br>
        **400**: if the payload failed the serializer check <br>
        **409**: if the username is already exist <br>
        """

        data = request.data

        # validate fields
        tmp_serializer = UserSerializer(data=data)
        if not tmp_serializer.is_valid():
            return Response(tmp_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            user = User.objects.create_user(username=data['username'], password=data['password'])
            token = Token.objects.create(user=user)
            return Response({"msg": "success, created user {}".format(user.username), "token": token.key},
                            status=status.HTTP_201_CREATED)

        return Response("User with username already exists", status=status.HTTP_409_CONFLICT)
