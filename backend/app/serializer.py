from rest_framework import serializers
from .models import *
from .models import User


class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['userType', 'dob']
