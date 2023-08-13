from django.db import models


class User(models.Model):
    userType = models.CharField(max_length=100)
    dob = models.CharField(max_length=277)


class Product(models.Model):
    firestore_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
