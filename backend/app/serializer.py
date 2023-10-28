from rest_framework import serializers
from .models import *
from django.db import IntegrityError


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
            'social_media_link',
            'premium_feature'
        )


class BuyerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "first_name",
                  "last_name", "gender", "phone_number"]


class SellerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "first_name", "last_name", "gender"]


class SellerSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = (
            'user_id',
            'gender',
            'category',
            'size',
            'type'
        )


class SellerBusinessProfileSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["business_name", "business_description",
                  "business_type", "location", "contact_info", "social_media_link"]


class CartSeliazer (serializers.ModelSerializer):
    class Meta:
        model = Cart
        exclude = ['buyer_id']


class WishlistSeliazer (serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        exclude = ['buyer_id']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class EditItemSerializer(serializers.ModelSerializer):
    size = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)

    class Meta:
        model = Item
        fields = '__all__'
       


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'


class CategorySelectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

        #exclude = ['date_of_birth','role']
        
class PaidOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaidOrder
        fields = [
            "receipt_url",
            "charge_id",
            "buyer_id",
            "seller_id",
            "status",
            "rated",
            "created_at"
        ]


class CheckoutDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaidOrder
        fields = [
            'listing_id',
            'item_id',
            'quantity',
            'size',
        ]
