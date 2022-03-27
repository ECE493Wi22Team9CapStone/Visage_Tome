import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    username = models.CharField(primary_key=True, max_length=100)
    password = models.CharField(max_length=100)
    bantime = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD='username'

    def __str__(self):
        return "(" + self.username + ") "
