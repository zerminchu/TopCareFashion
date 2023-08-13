from rest_framework import serializers
from .models import *
from .models import User


class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['userType', 'dob']


class ProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
