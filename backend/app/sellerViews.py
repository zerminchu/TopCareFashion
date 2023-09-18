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
def onBoarding(request):
  if request.method == "POST":
    try:
      data = request.data
      stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"

      if(data.get("user_id") is not None):
        # Validation
        if((data["user_id"] == "")):
           raise Exception("User id cannot be empty")
        
        # Create Stripe account
        createConnectedAccount = stripe.Account.create(type="standard")

        # Generate link for user to fill up information
        linkAccount = stripe.AccountLink.create(
          account = createConnectedAccount.stripe_id,
          refresh_url = "http://localhost:5173/",
          return_url = "http://localhost:5173/",
          type = "account_onboarding",
        )

        # Store data to Firestore
        db = firestore.client()
        collection_ref = db.collection('Users')
        collection_ref.document(data["user_id"]).update({"stripe_id": createConnectedAccount.stripe_id})

        return JsonResponse({
          'status': "success",
          'message': "Link to onboard retrieved successfully",
          'data': linkAccount
        }, status=200)

      elif(data.get("stripe_id") is not None):
        # Validation
        if((data["stripe_id"] == "")):
           raise Exception("Stripe ID cannot be empty")
        
        # Generate link for existing stripe account to fill up information
        linkExistingAccount = stripe.AccountLink.create(
          account = data["stripe_id"],
          refresh_url = "http://127.0.0.1:5173/",
          return_url = "http://127.0.0.1:5173/",
          type = "account_onboarding",
        )

        return JsonResponse({
          'status': "success",
          'message': "Link to onboard retrieved successfully",
          'data': linkExistingAccount
        }, status=200)

    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["POST"])
def checkOnBoardingCompleted(request):
  if request.method == "POST":
    try:
      data = request.data

      stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"

      # Validation
      if(data["stripe_id"] == ""):
        raise Exception("Stripe ID Cannot be empty")

      # Retrieve stripe account
      connectedAccount = stripe.Account.retrieve(data["stripe_id"])

      return JsonResponse({
          'status': "success",
          'message': "Stripe account retrieved successfully",
          'onBoardingCompleted': (connectedAccount["charges_enabled"] and connectedAccount["details_submitted"])
      }, status=200)
    
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["GET"])
def getSellerProfile(request, user_id):
  if request.method == "GET":
    try:
        db = firestore.client()
        userRef = db.collection('Users').document(user_id)
        userDoc = userRef.get()

        if not userDoc.exists:
            raise Exception("User not found")
            
        userData = userDoc.to_dict()

        return JsonResponse({
          'status': "success",
          'message': "Business profile updated successfully",
          'data': userData
        }, status=200)
            
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)

@api_view(["POST"])
def updateBusinessProfile(request, user_id):
  if request.method == "POST":
    try:
      data = request.data

      # Check if seller account exists
      db = firestore.client()
      userRef = db.collection('Users').document(user_id)
      userDoc = userRef.get()

      if(not userDoc.exists):
        raise Exception("User not found")

      # Validation
      if(not all(v for v in data.values())):
        raise Exception("Please fill up all the data")

      # Serializer
      serializer = SellerBusinessProfileSerializer(data=data)

      if (serializer.is_valid()):        
        updateBusinessProfile = userRef.update({"business_profile": data})

        return JsonResponse({
          'status': "success",
          'message': "Business profile updated successfully",
          'data': data
        }, status=200)
      else:
        raise Exception(serializer.errors)
    
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)
    
@api_view(["GET"])
def getReviews(request, user_id):
    if request.method == "GET":
        try:
            reviewsData = [
                {
                    "review_id": "review_id_1",
                    "product_name": "Vintage Sunglasses",
                    "rating": 3,
                    "description": "average product, nothing special",
                    "listing_id": "listing_id_8",
                    "buyer_id": "user_id_3",
                    "buyer_name": "Violet Marquez",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-07-30",
                    "reply": ""
                },
                {
                    "review_id": "review_id_2",
                    "product_name": "Leather Boots",
                    "rating": 5,
                    "description": "amazing quality, very comfortable",
                    "listing_id": "listing_id_9",
                    "buyer_id": "user_id_5",
                    "buyer_name": "Laylani Baldwin",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-07-31",
                    "reply": ""
                },
                {
                    "review_id": "review_id_3",
                    "product_name": "Digital Watch",
                    "rating": 4,
                    "description": "good value for money",
                    "listing_id": "listing_id_10",
                    "buyer_id": "user_id_7",
                    "buyer_name": "Julia Graham",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-01",
                    "reply": "Happy to hear that!"
                },
                {
                    "review_id": "review_id_4",
                    "product_name": "Canvas Bag",
                    "rating": 2,
                    "description": "not as durable as expected",
                    "listing_id": "listing_id_11",
                    "buyer_id": "user_id_9",
                    "buyer_name": "Ansley Barnes",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-02",
                    "reply": "We'll look into this, thanks."
                },
                {
                    "review_id": "review_id_5",
                    "product_name": "Denim Jacket",
                    "rating": 4,
                    "description": "looks stylish and is warm",
                    "listing_id": "listing_id_12",
                    "buyer_id": "user_id_11",
                    "buyer_name": "Isla Wilkins",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-03",
                    "reply": ""
                },
                {
                    "review_id": "review_id_6",
                    "product_name": "Bluetooth Headphones",
                    "rating": 5,
                    "description": "sound quality is top-notch",
                    "listing_id": "listing_id_13",
                    "buyer_id": "user_id_13",
                    "buyer_name": "Margaret Tyler",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-04",
                    "reply": ""
                },
                {
                    "review_id": "review_id_7",
                    "product_name": "Ceramic Mug",
                    "rating": 3,
                    "description": "design is nice but a bit fragile",
                    "listing_id": "listing_id_14",
                    "buyer_id": "user_id_15",
                    "buyer_name": "Ana Flowers",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-05",
                    "reply": ""
                },
                {
                    "review_id": "review_id_8",
                    "product_name": "Yoga Mat",
                    "rating": 4,
                    "description": "very comfortable for exercises",
                    "listing_id": "listing_id_15",
                    "buyer_id": "user_id_17",
                    "buyer_name": "Aubrielle Ponce",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-06",
                    "reply": "Happy to serve!"
                },
                {
                    "review_id": "review_id_9",
                    "product_name": "Acoustic Guitar",
                    "rating": 5,
                    "description": "lovely sound and beautiful design",
                    "listing_id": "listing_id_16",
                    "buyer_id": "user_id_19",
                    "buyer_name": "Rosa Perry",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-07",
                    "reply": "Enjoy your music!"
                },
                {
                    "review_id": "review_id_10",
                    "product_name": "Running Shoes",
                    "rating": 3,
                    "description": "a bit tight from the sides",
                    "listing_id": "listing_id_17",
                    "buyer_id": "user_id_21",
                    "buyer_name": "Saul Carr",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-08",
                    "reply": "Noted, we'll consider this in future designs."
                },
                {
                    "review_id": "review_id_11",
                    "product_name": "Laptop Stand",
                    "rating": 4,
                    "description": "makes working from home easier",
                    "listing_id": "listing_id_18",
                    "buyer_id": "user_id_23",
                    "buyer_name": "Jemma Davenport",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-09",
                    "reply": "Thank you for choosing us!"
                },
                {
                    "review_id": "review_id_12",
                    "product_name": "Desk Lamp",
                    "rating": 5,
                    "description": "perfect brightness, very flexible",
                    "listing_id": "listing_id_19",
                    "buyer_id": "user_id_25",
                    "buyer_name": "Dariel Stewart",
                    "seller_id": "1vUclhY7gUO5lBIvpOgkNTgFm6E2",
                    "date": "2023-08-10",
                    "reply": "Thanks for your kind words!"
                }
            ]

            updatedReviews = []

            # Retrieve all reviews from seller id
            db = firestore.client()
            reviewRef = db.collection('Review').where('seller_id', '==', user_id)
            reviewData = reviewRef.get()

            for doc in reviewData:
              eachReview = {}

              # Get user
              buyerRef = db.collection('Users').document((doc.to_dict())['buyer_id'])
              buyerData = (buyerRef.get()).to_dict()

              # Get listing
              listingRef = db.collection('Listing').document((doc.to_dict())['listing_id'])
              listingData = (listingRef.get()).to_dict()
              
              # Get item
              itemRef = db.collection('Item').document(listingData['item_id'])
              itemData = (itemRef.get()).to_dict()

              eachReview['review_id'] = (doc.to_dict())['review_id']
              eachReview['product_name'] = itemData['title']
              eachReview['rating'] = (doc.to_dict())['rating']
              eachReview['description'] = (doc.to_dict())['description']
              eachReview['listing_id'] = (doc.to_dict())['listing_id']
              eachReview['buyer_id'] = (doc.to_dict())['buyer_id']
              eachReview['buyer_name'] = buyerData['name']['first_name']
              eachReview['seller_id'] = (doc.to_dict())['seller_id']
              eachReview['date'] = (doc.to_dict())['date']
              eachReview['reply'] = (doc.to_dict())['reply']

              updatedReviews.append(eachReview)

            ratingQuery = request.GET.get('rating', None)
            startDateQuery = request.GET.get('start-date', None)
            endDateQuery = request.GET.get('end-date', None)
            searchQuery = request.GET.get('search', None)

            # Apply filter
            if(ratingQuery is not None):
              updatedReviews = [item for item in updatedReviews if item["rating"] == int(ratingQuery)]

            if(startDateQuery is not None):
              startDateObj = datetime.strptime(startDateQuery, "%Y-%m-%d").date()

              updatedReviews = [
                  review for review in updatedReviews 
                  if startDateObj <= datetime.strptime(review["date"], "%Y-%m-%d").date()
              ]

            if(endDateQuery is not None):
              endDateObj = datetime.strptime(endDateQuery, "%Y-%m-%d").date()

              updatedReviews = [
                  review for review in updatedReviews 
                  if endDateObj >= datetime.strptime(review["date"], "%Y-%m-%d").date()
              ]
            
            if(searchQuery is not None):
              searchQuery = searchQuery.lower()

              updatedReviews = [
                  review for review in updatedReviews
                  if searchQuery in review["buyer_name"].lower() or
                    searchQuery in review["product_name"].lower() or
                    searchQuery in review["description"].lower() or
                    searchQuery in review["reply"].lower()
              ]

            return JsonResponse({
                'status': "success",
                'message': "Reviews data retrieved successfully",
                'data': updatedReviews
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)
        
@api_view(["POST"])
def replyReview(request):
    if request.method == "POST":
        try:
            data = request.data

            # Validation
            if(data["review_id"] == ""):
               raise Exception("Review ID cannot be empty")
            
            if(data["reply"] == ""):
               raise Exception("Reply cannot be empty")

            # Update review
            db = firestore.client()
            reviewRef = db.collection("Review").document(data["review_id"])
            updateReview = reviewRef.update({"reply": data["reply"]})

            return JsonResponse({
                'status': "success",
                'message': "Replied uploaded successfully",
                'data': data["reply"]
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)