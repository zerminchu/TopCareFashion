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
