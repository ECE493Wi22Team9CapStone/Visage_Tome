"""
    This file contains all the unit tests for the users app
    Related Functional Requirements: None
"""

# Create your tests here.
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from users.models import User
import shutil, tempfile

class UserTestCases(TestCase):
    def setUp(self):
        self.client = APIClient()

        # super useer
        self.admin = User.objects.create_superuser(
            username='admin',
            password='admin123'
        )
        Token.objects.create(user=self.admin)

        # self.user2 will be pre created with a like to self.post
        self.user = User.objects.create_user(
            username='user',
            password='password123'
        )
        Token.objects.create(user=self.user)

    def test_signup_success(self):
        # verify signup works

        payload = {
            "username": "testuser",
            "password": "password123"
        }
        response = self.client.post('/users/signup/', payload)

        # check the response
        self.assertEqual(response.data.msg, "success, created user testuser")
        user = User.objects.get(username='testuser')
        #        token = Token.objects.get(user=user)


    def test_signup_failure(self):
        payload = {
            "username": "testuser",
            "password": "password123"
        }
        response = self.client.post('/users/signup/', payload)

        # check the response
        self.assertEqual(response.data.msg, "success, created user testuser")
        user = User.objects.get(username='testuser')

        # try to send again, user already exists
        response = self.client.post('/users/signup/', payload)

        # check the response conflict
        self.assertEqual(response.status_code, 409)
        user.delete()

    def test_user_login_success(self):
        payload = {
            "username": "admin",
            "password": "admin123"
        }
        response = self.client.post('/users/', payload)

        # check the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.token, Token.objects.get(self.admin).key)
        pass

    def test_user_login_failure_username(self):
        payload = {
            "username": "idontexist",
            "password": "password123"
        }
        response = self.client.post('/users/', payload)

        # check the response
        self.assertEqual(response.status_code, 400)
        pass

    def test_user_login_failure_password(self):
        payload = {
            "username": "user",
            "password": "invalidpassword"
        }
        response = self.client.post('/users/', payload)

        # check the response
        self.assertEqual(response.status_code, 400)
        pass

    def test_user_missing_fields(self):
        payload = {
            "username": "user",
        }
        response = self.client.post('/users/', payload)

        # check the response
        self.assertEqual(response.status_code, 400)
        pass

    def test_user_ban(self):
        payload = {
            "username": "user",
            "bantime": "2050-03-28T10:30:25.291Z"
        }
        response = self.client.patch('/users/', payload)
        self.assertEqual(response.status_code, 200)

        login_payload = {
            "username": "user",
            "password": "password123"
        }
        login_response = self.client.post('/users/', payload)
        self.assertEqual(login_response.status_code, 401)

        pass
