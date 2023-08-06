from django.db import models


class User(models.Model):
    userType = models.CharField(max_length=100)
    dob = models.CharField(max_length=277)
