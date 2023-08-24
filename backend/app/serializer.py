from rest_framework import serializers
from .models import *
from .models import User


# class UserSerializer (serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['userType', 'dob']

class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = (
            'user_id',
            'stripe_id',
            'business_name',
            'business_type',
            'location',
            'contact_info',
            'social_media_link'
        )

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "first_name", "last_name", "gender"]

class SellerSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = (
            'user_id',
            'gender',
            'color',
            'size',
            'type'
        )


class ProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
