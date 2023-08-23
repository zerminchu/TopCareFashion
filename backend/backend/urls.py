from django.contrib import admin
from django.urls import path, include, re_path
from app.views import *
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("register/", views.signUp, name="register"),
    path("sign-in/", views.signIn, name="login"),
    path("sign-up/", views.signUp, name="sign-up"),
    path("sign-out/", views.signOut, name="sign-out"),
    path("recover-password/", views.recoverPassword, name="recover-password"),
    path("verify-id-token/", views.verifyIdToken, name="verify-id-token"),
    path("retrieve-user-info-from-token/", views.retrieveUserInfoFromToken, name="retrieve-user-info-from-token"),
    path("update-profile/", views.updateProfile, name="update-profile")
]
