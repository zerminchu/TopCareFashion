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
import json

@api_view(["POST"])
def getCheckoutLink(request):
  if request.method == "POST":
    try:
        data = request.data

        if(len(data["checkout"]) <= 0):
           raise Exception("Checkout should have at least 1 item")
        
        if(len(data["meta_data"]) <= 0):
           raise Exception("Meta data cannot be empty")
        
        metaData = {}
        metaData["buyer_id"] = data["meta_data"]["buyer_id"]
        metaData["created_at"] = data["meta_data"]["created_at"]
        metaData["checkout_data"] = json.dumps(data["meta_data"]["checkout_data"])
        
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
            line_items=items,
            metadata=metaData
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
                 "seller_id": data["seller_id"],
                 "size": data["size"]
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
    
@api_view(["POST"])
def addToWishlist(request):
  if request.method == "POST":
    try:
        data = request.data

        if(len(data["buyer_id"]) <= 0):
           raise Exception("Buyer id cannot be empty")
        
        serializer = WishlistSeliazer(data=data)

        if(serializer.is_valid()):
          db = firestore.client()
 
          wishlistQuery = db.collection("Wishlist").where("buyer_id", "==", data["buyer_id"]).limit(1)
          wishlistQueryData = wishlistQuery.get()

          # Check if wishlist has been created before
          if(len(wishlistQueryData) <= 0):
            wishlistId = (db.collection('Wishlist').document()).id
            wishlistRef = db.collection('Wishlist').document(wishlistId)

            wishlistRef.set({
                "wishlist_id": wishlistId,
                "buyer_id": data["buyer_id"]
            })

            wishlistItemId = (wishlistRef.collection('WishlistItem').document()).id
            wishlistItemRef = wishlistRef.collection('WishlistItem').document(wishlistItemId)

            wishlistItemRef.set({
                "wishlist_item_id": wishlistItemId,
                "listing_id": data["listing_id"],
                "item_id": data["item_id"],
                "created_at": data["created_at"],
                "seller_id": data["seller_id"],
                "size": data["size"]
            })

          else:
            # Check if there is existing wishlist item
            wishlistRef = db.collection("Wishlist").document((wishlistQueryData[0].to_dict())["wishlist_id"])

            wishlistItemId = (wishlistRef.collection('WishlistItem').document()).id

            wishlistItemRef = wishlistRef.collection('WishlistItem').document(wishlistItemId)

            allWishlistItems = wishlistRef.collection("WishlistItem").get()
            
            for wishlistItem in allWishlistItems:
              if((wishlistItem.to_dict())["listing_id"] == data["listing_id"]):
                raise Exception("Listing already added to wishlist before")
            
            wishlistItemRef.set({
                "wishlist_item_id": wishlistItemId,
                "listing_id": data["listing_id"],
                "item_id": data["item_id"],
                "created_at": data["created_at"],
                "seller_id": data["seller_id"],
                "size": data["size"]
            })
        else:
          raise Exception(serializer.errors)
        
        return JsonResponse({
        'status': "success",
        'message': "Added to wishlist successfully",
        'data': data
        }, status=200)
        
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["GET"])
def getWishlistListByUserId(request, user_id):
  if request.method == "GET":
    try:
      if(len(user_id) <= 0):
        raise Exception("User id cannot be empty")
      
      db = firestore.client()

      wishlistQuery = db.collection("Wishlist").where("buyer_id", "==", user_id).limit(1)
      wishlistQueryData = wishlistQuery.get()
      wishlistItems = []

      if(len(wishlistQueryData) <= 0):
        return JsonResponse({
          'status': "success",
          'message': "Wishlist list retrieved successfully",
          'data': wishlistItems
        }, status=200)
      
      wishlistId = (wishlistQueryData[0].to_dict())["wishlist_id"]
      wishlistItemRef = db.collection("Wishlist").document(wishlistId).collection("WishlistItem")
      wishlistItemData = wishlistItemRef.stream()

      for wishlistItem in wishlistItemData:
        wishlistItems.append(wishlistItem.to_dict())

      return JsonResponse({
        'status': "success",
        'message': "Wishlist list retrieved successfully",
        'data': wishlistItems
      }, status=200)

    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["GET"])
def getWishlistDetails(request, user_id, wishlist_item_id):
  if request.method == "GET":
    try:
      if(len(user_id) <= 0):
        raise Exception("User id cannot be empty")
      
      if(len(wishlist_item_id) <= 0):
        raise Exception("Wishlist item id cannot be empty")
      
      db = firestore.client()

      wishlistQuery = db.collection("Wishlist").where("buyer_id", "==", user_id).limit(1)
      wishlistQueryData = wishlistQuery.get()

      if(len(wishlistQueryData) <= 0):
        raise Exception("User does not have wishlist item")
      
      wishlistId = (wishlistQueryData[0].to_dict())["wishlist_id"]

      wishlistItemRef = db.collection("Wishlist").document(wishlistId).collection("WishlistItem").document(wishlist_item_id)
      wishlistItemData = wishlistItemRef.get()

      itemRef = db.collection("Item").document((wishlistItemData.to_dict())["item_id"])
      itemData = itemRef.get()

      fullData = {
        "wishlist_id": wishlistId,
        "wishlist_item_id":(wishlistItemData.to_dict())["wishlist_item_id"],
        "images": (itemData.to_dict())["image_urls"],
        "title": (itemData.to_dict())["title"],
        "size": (wishlistItemData.to_dict())["size"],
        "price": (itemData.to_dict())["price"],
        "category": (itemData.to_dict())["category"]
      }

      return JsonResponse({
        'status': "success",
        'message': "Wishlist detail data retrieved successfully",
        'data': fullData
      }, status=200)

    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["GET"])
def getCartDetailsByUserId(request, user_id):
  if request.method == "GET":
    try:
      if(len(user_id) <= 0):
        raise Exception("User id should not be empty")
      
      db = firestore.client()
      cartRef = db.collection("Cart").where("buyer_id", "==", user_id).limit(1)
      cartQueryData = cartRef.get()

      cartItems = []

      if(len(cartQueryData) <= 0):
        return JsonResponse({
          'status': "success",
          'message': "Cart detail data retrieved successfully",
          'data': cartItems
        }, status=200)

      cartId = (cartQueryData[0].to_dict())["cart_id"]
      cartItemRef = db.collection('Cart').document(cartId).collection('CartItem').stream()
      
      for item in cartItemRef:
          fullData = {}
          
          itemRef = db.collection("Item").document((item.to_dict())["item_id"])
          itemData = itemRef.get()

          fullData["cart_id"] = cartId
          fullData["cart_item_id"] = (item.to_dict())["cart_item_id"]
          fullData["images"] = (itemData.to_dict())["image_urls"]
          fullData["title"] = (itemData.to_dict())["title"]
          fullData["category"] = (itemData.to_dict())["category"]
          fullData["size"] = (item.to_dict())["size"]
          fullData["quantity"] = (item.to_dict())["cart_quantity"]
          fullData["price"] = (itemData.to_dict())["price"]

          cartItems.append(fullData)

      return JsonResponse({
        'status': "success",
        'message': "Cart detail data retrieved successfully",
        'data': cartItems
      }, status=200)

    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["DELETE"])
def updateWishlistItem(request, wishlist_id, wishlist_item_id):
  if request.method == "DELETE":
    try:
      if(len(wishlist_id) <= 0):
        raise Exception("Wishlist id cannot be empty")
      
      if(len(wishlist_item_id) <= 0):
        raise Exception("Wishlist item id cannot be empty")
      
      db = firestore.client()
      wishlistItemRef = db.collection("Wishlist").document(wishlist_id).collection("WishlistItem").document(wishlist_item_id)
      wishlistItemData = wishlistItemRef.delete()

      return JsonResponse({
        'status': "success",
        'message': "Wishlist item deleted successfully",
        'data': wishlistItemData
      }, status=200)
    
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["PUT", "DELETE"])
def updateCartItem(request, cart_id, cart_item_id):
  if request.method == "PUT":
    try:
      data = request.data

      if(len(cart_id) <= 0):
        raise Exception("Cart id cannot be empty")
      
      if(len(cart_item_id) <= 0):
        raise Exception("Cart item id cannot be empty")
      
      if(data["cart_quantity"] < 1):
        raise Exception("Cart quantity cannot be below 1")
      
      db = firestore.client()
      cartItemRef = db.collection("Cart").document(cart_id).collection("CartItem").document(cart_item_id)
      cartItemRef.update({"cart_quantity": data["cart_quantity"]})

      return JsonResponse({
        'status': "success",
        'message': "Cart item updated successfully",
        'data': {
          "cart_quantity": data["cart_quantity"]
        }
      }, status=200)

    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
  
  if request.method == "DELETE":
    try:
      if(len(cart_id) <= 0):
        raise Exception("Cart id cannot be empty")
      
      if(len(cart_item_id) <= 0):
        raise Exception("Cart item id cannot be empty")
      
      db = firestore.client()
      cartItemRef = db.collection("Cart").document(cart_id).collection("CartItem").document(cart_item_id)
      cartItemData = cartItemRef.delete()

      return JsonResponse({
        'status': "success",
        'message': "Cart item deleted successfully",
        'data': cartItemData
      }, status=200)
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["GET"])
def getAllOrdersByUserId(request, user_id):
    if request.method == "GET":
        try:
            if(len(user_id) <= 0):
               raise Exception("User id cannot be empty")
            
            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").where("buyer_id", "==", user_id)
            paidOrderData= paidOrderRef.stream()

            paidOrderList = []

            for order in paidOrderData:
              paidOrderList.append(order.to_dict())

            return JsonResponse({
                'status': "success",
                'message': "Paid order list retrieved successfully",
                'data': paidOrderList
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)
        
@api_view(["GET"])
def getOrderDetails(request, paid_order_id):
    if request.method == "GET":
        try:
            if(len(paid_order_id) <= 0):
               raise Exception("Paid order id cannot be empty")
            
            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").document(paid_order_id)
            paidOrderData= paidOrderRef.get()

            if(not paidOrderData.exists):
               raise Exception("Paid order data does not exists")

            itemRef = db.collection("Item").document((paidOrderData.to_dict())["checkout_data"]["item_id"])
            itemData = itemRef.get()

            if(not itemData.exists):
               raise Exception("Item data does not exists")

            userRef = db.collection("Users").document((paidOrderData.to_dict())["buyer_id"])
            userData = userRef.get()

            if(not userData.exists):
               raise Exception("User data does not exists")

            responseData = {
               "buyer_name": (userData.to_dict())["name"]["first_name"],
               "images": (itemData.to_dict())["image_urls"],
               "title": (itemData.to_dict())["title"],
               "category": (itemData.to_dict())["category"],
               "size": (paidOrderData.to_dict())["checkout_data"]["size"],
               "price": (itemData.to_dict())["price"],
               "status": (paidOrderData.to_dict())["status"],
               "quantity": (paidOrderData.to_dict())["checkout_data"]["quantity"],
               "rated": (paidOrderData.to_dict())["rated"]
            }

            return JsonResponse({
                'status': "success",
                'message': "Paid order detail retrieved successfully",
                'data': responseData
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)
        
@api_view(["GET"])
def getOrderStatus(request, paid_order_id):
    if request.method == "GET":
        try:
            if(len(paid_order_id) <= 0):
               raise Exception("Paid order id cannot be empty")
            
            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").document(paid_order_id)
            paidOrderData= paidOrderRef.get()

            if(not paidOrderData.exists):
               raise Exception("Paid order data does not exists")

            itemRef = db.collection("Item").document((paidOrderData.to_dict())["checkout_data"]["item_id"])
            itemData = itemRef.get()

            listingRef = db.collection("Listing").document((paidOrderData.to_dict())["checkout_data"]["listing_id"])
            listingData = listingRef.get()

            if(not itemData.exists):
               raise Exception("Item data does not exists")
            
            if(not listingData.exists):
               raise Exception("Listing data does not exists")
            
            userRef = db.collection("Users").document((paidOrderData.to_dict())["seller_id"])
            userData = userRef.get()

            if(not userData.exists):
               raise Exception("User data does not exists")
            
            subTotal = int((paidOrderData.to_dict())["checkout_data"]["quantity"]) * float((itemData.to_dict())["price"])

            responseData = {
               "seller_id": (userData.to_dict())["user_id"],
               "listing_id": (listingData.to_dict())["listing_id"],
               "store_name": (userData.to_dict())["business_profile"]["business_name"],
               "images": (itemData.to_dict())["image_urls"],
               "title": (itemData.to_dict())["title"],
               "category": (itemData.to_dict())["category"],
               "size": (paidOrderData.to_dict())["checkout_data"]["size"],
               "collection_address": (listingData.to_dict())["collection_address"],
               "price": float((itemData.to_dict())["price"]),
               "status": (paidOrderData.to_dict())["status"],
               "quantity": (paidOrderData.to_dict())["checkout_data"]["quantity"],
               "sub_total": subTotal
            }

            return JsonResponse({
                'status': "success",
                'message': "Order status retrieved successfully",
                'data': responseData
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)