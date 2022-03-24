from django.urls import path
from .views import *

urlpatterns = [
    path("", UserView.as_view(), name='userLogin'),
    path("signup", UserSignupView.as_view(), name='userSignup')
]
