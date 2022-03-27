import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    bantime = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD='username'

    def __str__(self):
        return "(" + self.username + ") "
