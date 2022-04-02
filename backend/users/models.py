"""
    This file contains the models for the users app
    Related Functional Requirements:
    * FR1 - User.Registration
    * FR2 - User.Login
    * FR10 - Ban.User
"""

import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    bantime = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD='username'

    def __str__(self):
        return "(" + self.username + ") "
