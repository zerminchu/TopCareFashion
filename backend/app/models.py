from django.db import models


class Item(models.Model):
    category = models.CharField(max_length=255)
    condition = models.CharField(max_length=255)
    colour = models.CharField(max_length=255)
    image_url = models.CharField(max_length=255)
