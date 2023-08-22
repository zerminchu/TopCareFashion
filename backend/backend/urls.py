from django.contrib import admin
from django.urls import path, include, re_path
from app.views import *
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("reset-password/", views.resetPassword, name="reset-password")
]
