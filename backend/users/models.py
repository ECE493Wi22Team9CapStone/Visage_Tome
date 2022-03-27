import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(primary_key=True, max_length=100)
    password = models.CharField(max_length=100)
    isbanned = models.BooleanField(default=False)

    USERNAME_FIELD='username'

    def __str__(self):
        return "(" + self.username + ") "
