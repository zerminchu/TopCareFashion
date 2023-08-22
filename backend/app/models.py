from django.db import models


# class User(models.Model):
#     userType = models.CharField(max_length=100)
#     dob = models.CharField(max_length=277)

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
    user_id = models.CharField(max_length=100, unique=True, default="")
    username = models.CharField(max_length=100, blank=True, null=False)
    first_name = models.CharField(max_length=100, blank=True, null=False)
    last_name = models.CharField(max_length=100, blank=True, null=False)
    verified_status = models.BooleanField(default=False)
    email = models.EmailField(unique=True, null=False)
    date_of_birth = models.DateTimeField(null=False, blank=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, null=False, blank=False)
    profile_image = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # Buyer
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
        return self.username


class Product(models.Model):
    firestore_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
