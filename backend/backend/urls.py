from django.contrib import admin
from django.urls import path, include, re_path
from app.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', UserView.as_view())
]
