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

    # General
    user_id = models.CharField(max_length=100, unique=True, default="", )
    first_name = models.CharField(max_length=100, blank=True, null=False)
    last_name = models.CharField(max_length=100, blank=True, null=False)
    # verified_status = models.BooleanField(default=False)
    email = models.EmailField(unique=True, null=False, blank=True)
    date_of_birth = models.DateTimeField(null=False, blank=False)
    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, null=False, blank=False)
    profile_image = models.URLField(blank=True, null=True)
    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES, null=False, blank=True)

    # Buyer
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    size = models.CharField(max_length=20, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)

    # Seller
    stripe_id = models.CharField(max_length=100, blank=True, null=True)
    business_name = models.CharField(max_length=100, blank=True, null=True)
    business_type = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    contact_info = models.CharField(max_length=200, blank=True, null=True)
    social_media_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.first_name


class Item(models.Model):
    category = models.CharField(max_length=255)
    condition = models.CharField(max_length=255)
    colour = models.CharField(max_length=255)
    image_urls = models.JSONField(default=list)


class Listing(models.Model):
    collection_address = models.CharField(max_length=255)
