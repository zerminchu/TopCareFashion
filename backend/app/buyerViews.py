from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from . models import *
from . serializer import *
from .exceptions import *
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from firebase_admin import firestore
from django.core.files.base import ContentFile
from datetime import datetime

from firebase_admin import storage
from firebase_admin import auth
from django.core.validators import validate_email
from django.core.files.storage import FileSystemStorage
from rest_framework.permissions import IsAuthenticated

from config.firebase import firebase

import stripe

@api_view(["POST"])
def getCheckoutLink(request):
  if request.method == "POST":
    try:
        data = request.data

        if(len(data["checkout"]) <= 0):
           raise Exception("Checkout should have at least 1 item")
        
        items = []
        
        for checkoutItem in data["checkout"]:
          item = {}

          if(len(checkoutItem["title"]) <= 0):
            raise Exception("Product title should not be empty")
      
          if(checkoutItem["price"] <= 0):
            raise Exception("Price should not be below 0")
          
          if(checkoutItem["quantity"] <= 0):
            raise Exception("Quantity should not be below 0")
          
          if(isinstance(checkoutItem["quantity"], float)):
            raise Exception("Quantity should be integer number")
          
          item = {
              'price_data': {
                  'currency': 'sgd',
                  'product_data': {
                      'name': checkoutItem["title"],
                  },
                  'unit_amount': int(checkoutItem["price"] * 100),  # Amount in cents
              },
              'quantity': checkoutItem["quantity"]
          }

          items.append(item)

        stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"

        checkoutSession = stripe.checkout.Session.create(
            mode="payment",
            success_url='http://localhost:5173/',
            cancel_url='http://localhost:5173/',
            payment_method_types=['card'],
            line_items=items
        )

        return JsonResponse({
          'status': "success",
          'message': "Checkout successfully",
          'data': checkoutSession
        }, status=200)
    
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)