from django.db import models


class User(models.Model):
    GENDER_CHOICES = (
        ('male', 'male'),
        ('female', 'female')
    )
    ROLE_CHOICES = (
        ('buyer', 'buyer'),
        ('seller', 'seller'),
        ('admin', 'admin'),
    )
    BUSINESS_TYPE_CHOICES = (
        ('retailer', 'retailer'),
        ('manufacturer', 'manufacturer'),
        ('distributor', 'distributor'),
    )

    # General
    user_id = models.CharField(max_length=100, unique=True, default="", )
    first_name = models.CharField(max_length=100, blank=True, null=False)
    last_name = models.CharField(max_length=100, blank=True, null=False)
    email = models.EmailField(unique=True, null=False, blank=True)
    date_of_birth = models.DateTimeField(null=False, blank=False)
    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, null=False, blank=False)
    profile_image = models.URLField(blank=True, null=True)
    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES, null=False, blank=True)

    # Buyer
    premium_feature = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=20, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)

    # Seller
    stripe_id = models.CharField(max_length=100, blank=True, null=True)
    business_name = models.CharField(max_length=100, blank=True, null=True)
    business_description = models.CharField(
        max_length=1000, blank=True, null=True)
    business_type = models.CharField(
        max_length=50, choices=BUSINESS_TYPE_CHOICES, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    contact_info = models.CharField(max_length=200, blank=True, null=True)
    social_media_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.first_name


class Item(models.Model):
    gender = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    sub_category = models.CharField(max_length=255)
    condition = models.CharField(max_length=255)
    colour = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    image_urls = models.JSONField(default=list)


class Listing(models.Model):
    avail_status = models.CharField(max_length=255)
    quantity_available = models.CharField(max_length=255)
    collection_address = models.CharField(max_length=255)


class Feedback(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=255)


class Cart(models.Model):
    listing_id = models.CharField(max_length=255, null=False, blank=False)
    item_id = models.CharField(max_length=255, null=False, blank=False)
    cart_quantity = models.PositiveIntegerField(null=False, blank=False)
    created_at = models.DateTimeField(null=False, blank=False)
    seller_id = models.CharField(max_length=255, null=False, blank=False)
    buyer_id = models.CharField(max_length=255, null=False, blank=False)
    size = models.CharField(max_length=255, null=False, blank=False)

class PaidOrder(models.Model):
    paid_order_id = models.CharField(max_length=255, null=False, blank=False)
    charge_id = models.CharField(max_length=255, null=False, blank=False)
    buyer_id = models.CharField(max_length=255, null=False, blank=False)
    status = models.CharField(max_length=255, null=False, blank=False)
    rated = models.BooleanField(default=False)
    seller_id = models.CharField(max_length=255, null=False, blank=False)
    created_at = models.DateTimeField(null=False, blank=False)
    listing_id = models.CharField(max_length=255, null=False, blank=False)
    item_id = models.CharField(max_length=255, null=False, blank=False)
    quantity = models.PositiveIntegerField(null=False, blank=False)
    size = models.CharField(max_length=255, null=False, blank=False)

class Wishlist(models.Model):
    listing_id = models.CharField(max_length=255, null=False, blank=False)
    item_id = models.CharField(max_length=255, null=False, blank=False)
    created_at = models.DateTimeField(null=False, blank=False)
    seller_id = models.CharField(max_length=255, null=False, blank=False)
    buyer_id = models.CharField(max_length=255, null=False, blank=False)
    size = models.CharField(max_length=255, null=False, blank=False)


class Review(models.Model):
    listing_id = models.CharField(max_length=255, null=False, blank=False)
    description = models.CharField(max_length=255, null=False, blank=False)
    date = models.DateTimeField(null=False, blank=False)
    rating = models.PositiveIntegerField(null=False, blank=False)
    seller_id = models.CharField(max_length=255, null=False, blank=False)
    buyer_id = models.CharField(max_length=255, null=False, blank=False)
    reply = models.CharField(max_length=255, null=False, blank=True)
