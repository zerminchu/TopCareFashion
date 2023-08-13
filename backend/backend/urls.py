from django.contrib import admin
from django.urls import path, include, re_path
from app.views import *
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', UserView.as_view()),
    path("add-product/", views.add_product, name="add-product"),
]
