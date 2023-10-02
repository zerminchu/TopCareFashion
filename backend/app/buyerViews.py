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

@api_view(["POST"])
def getPremiumFeatureCheckoutLink(request):
  if request.method == "POST":
    try:
        data = request.data

        if(len(data["user_id"]) <= 0):
          raise Exception("User id cannot be blank")
        
        db = firestore.client()
        userRef = db.collection('Users').document(data["user_id"])
        user = userRef.get()

        if(not user.exists):
          raise Exception("User does not exists")
        
        userRef.update({"premium_feature": True})
        
        stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"

        checkoutSession = stripe.checkout.Session.create(
            mode="payment",
            success_url='http://localhost:5173/buyer/premium-feature',
            cancel_url='http://localhost:5173/',
            payment_method_types=['card'],
            line_items=[
              {
                'price_data': {
                    'currency': 'sgd',
                    'product_data': {
                        'name': 'Top Care Fashion Premium Feature',
                    },
                    'unit_amount': 499,  # Amount in cents
                },
                'quantity': 1,
              },
            ],
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
    
@api_view(["PUT"])
def editReview(request):
  if request.method == "PUT":
    try:
        data = request.data

        # Validation
        if(data["review_id"] == ""):
            raise Exception("Review ID cannot be empty")
        
        if(data["description"] == ""):
            raise Exception("Review cannot be empty")

        # Update review
        db = firestore.client()
        reviewRef = db.collection("Review").document(data["review_id"])
        updateReview = reviewRef.update({"description": data["description"]})

        return JsonResponse({
          'status': "success",
          'message': "Edit review successfully",
          'data': data["description"]
        }, status=200)
    
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["POST"])
def addToCart(request):
  if request.method == "POST":
    try:
        data = request.data

        if(len(data["buyer_id"]) <= 0):
           raise Exception("Buyer id cannot be empty")
        
        serializer = CartSeliazer(data=data)

        if(serializer.is_valid()):
           db = firestore.client()

           
           cartQuery = db.collection("Cart").where("buyer_id", "==", data["buyer_id"]).limit(1)
           cartQueryData = cartQuery.get()

           # Check if cart has been created before
           if(len(cartQueryData) <= 0):
              cartId = (db.collection('Cart').document()).id
              cartRef = db.collection('Cart').document(cartId)

              cartRef.set({
                 "cart_id": cartId,
                 "buyer_id": data["buyer_id"]
              })

              cartItemId = (cartRef.collection('CartItem').document()).id
              cartItemRef = cartRef.collection('CartItem').document(cartItemId)

              cartItemRef.set({
                 "cart_item_id": cartItemId,
                 "listing_id": data["listing_id"],
                 "item_id": data["item_id"],
                 "created_at": data["created_at"],
                 "cart_quantity": data["cart_quantity"],
                 "seller_id": data["seller_id"],
                 "size": data["size"]
              })

           else:
              # Check if there is existing cart item

              cartRef = db.collection("Cart").document((cartQueryData[0].to_dict())["cart_id"])

              cartItemId = (cartRef.collection('CartItem').document()).id

              cartItemRef = cartRef.collection('CartItem').document(cartItemId)

              allCartItems = cartRef.collection("CartItem").get()
              
              for cartItem in allCartItems:
                 if((cartItem.to_dict())["listing_id"] == data["listing_id"]):
                    raise Exception("Listing already added to cart before")

              cartItemRef.set({
                 "cart_item_id": cartItemId,
                 "listing_id": data["listing_id"],
                 "item_id": data["item_id"],
                 "created_at": data["created_at"],
                 "cart_quantity": data["cart_quantity"],
                 "seller_id": data["seller_id"]
              })

           return JsonResponse({
            'status': "success",
            'message': "Added to cart successfully",
            'data': data
        }, status=200)
        else:
          raise Exception(serializer.errors)

    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)