import json
from datetime import datetime

import stripe
from config.firebase import firebase
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.core.validators import validate_email
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from firebase_admin import auth, firestore, storage
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .exceptions import *
from .models import *
from .serializer import *

@api_view(["GET", "POST"])
def allUsers(request):
  if request.method == "GET":
    try:
        db = firestore.client()

        role = request.GET.get('role', None)
        print("role: ", role)

        if(role is not None):
           userRef = db.collection("Users").where("role", "==", role)
           userData = userRef.get()
           response = [user.to_dict() for user in userData]
           
           return JsonResponse({
              'status': "success",
              'message': "All user data retrieved successfully",
              'data': response
            }, status=200)

        userRef = db.collection("Users")
        userData = userRef.get()

        response = [user.to_dict() for user in userData]
        
        return JsonResponse({
          'status': "success",
          'message': "All user data retrieved successfully",
          'data': response
        }, status=200)
    
    except Exception as e:
      return JsonResponse({
          "status": "error",
          "message": str(e)
      }, status=400)

  elif request.method == "POST":
      try:
        # Initialize firebase variable
        firebaseStorage = firebase.storage()
        db = firestore.client()

        data = request.data

        user_id = data.get('user_id')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        profile_image = data.get('profile_image')
        gender = data.get('gender')

        # Buyer
        phone_number = data.get('phone_number')
        preferences_condition = data.get('preferences_condition')
        preferences_gender = data.get('preferences_gender')
        preferences_price_range = data.get('preferences_price_range')
        preferences_size = data.get('preferences_size')

        userRef = db.collection("Users").document(user_id)
        userData = (userRef.get()).to_dict()

        if (userData and userData["role"] == "buyer"):
            serializer = BuyerUpdateProfileSerializer(data=data)
        elif (userData and userData["role"] == "seller"):
            serializer = SellerUpdateProfileSerializer(data=data)

        if (serializer.is_valid()):
            updatedData = {}


            # User want to update profile image
            if (profile_image):
                # Validate file format
                allowed_formats = ['image/jpeg', 'image/jpg', 'image/png']
                if profile_image.content_type not in allowed_formats:
                    raise Exception(
                        "Invalid file format. Only PNG, JPEG, and JPG formats are allowed.")

                # Upload the file to Firebase Storage
                firebaseStorage.child(
                    f"UserProfile/{user_id}").put(profile_image)

                # Generate public image url
                profile_image = firebaseStorage.child(
                    f"UserProfile/{user_id}").get_url(None)

                # Data to be updated for user
                updatedData = {
                    "name.first_name": first_name,
                    "name.last_name": last_name,
                    "profile_image_url": profile_image,
                    "gender": gender
                }

            # User does not want to update profile image
            else:
                # Update data into firestore
                collectionRef = db.collection('Users').document(user_id)

                # Data to be updated for user
                updatedData = {
                    "name.first_name": first_name,
                    "name.last_name": last_name,
                    "gender": gender
                }

            # Check whether it has phone number data or not
            if (phone_number and preferences_condition and preferences_gender and preferences_price_range and preferences_size):
                updatedData["phone_number"] = phone_number
                updatedData["preferences.condition"] = preferences_condition
                updatedData["preferences.gender"] = preferences_gender
                updatedData["preferences.price"]= json.loads(preferences_price_range)
                updatedData["preferences.size"] = preferences_size


            # Update data into firestore
            collectionRef = db.collection('Users').document(user_id)
            collectionRef.update(updatedData)

        else:
            raise Exception(serializer.errors)

        return JsonResponse({
            'status': "success",
            'message': "User profile updated successfully",
            'data': {
                "updatedFirstName": first_name,
                "updatedLastName": last_name,
                "updatedProfileImage": profile_image,
                "updatedGender": gender,
                "updatedPhoneNumber": phone_number
            }
        }, status=200)

      except Exception as e:
          return JsonResponse({
              "status": "error",
              "message": str(e)
          }, status=400)

@api_view(["DELETE"])
def oneUser(request, user_id):
    if request.method == "DELETE":
        try:
            data = request.data

            db = firestore.client()
            userRef = db.collection("Users").document(user_id)
            userData = userRef.delete()

            userAuth = auth.delete_user(user_id)

            return JsonResponse({
                'status': "success",
                'message': f"User {user_id} deleted successfully",
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)