from rest_framework import serializers
from .models import *


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
        fields = ["first_name", "last_name", "gender"]


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


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'


class ListingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Listing
        fields = '__all__'
