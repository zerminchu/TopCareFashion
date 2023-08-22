from django.contrib import admin
from django.urls import path, include, re_path
from app.views import *
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("register/", views.signUp, name="register"),
    path("sign-in/", views.signIn, name="login"),
    path("sign-up/", views.signUp, name="sign-up"),
    path("reset-password/", views.resetPassword, name="reset-password")
]
