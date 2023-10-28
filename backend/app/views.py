import io
import json
import os
import random
import re
import uuid

import numpy as np
import stripe
import tensorflow as tf
import torch
from config.firebase import firebase
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.core.validators import validate_email
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from fastai.vision.all import *
from firebase_admin import auth, firestore, storage
from PIL import Image
from rest_framework.decorators import (api_view, parser_classes,
                                       permission_classes)
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .exceptions import *
from .models import *
from .serializer import *

# from fastai.imports import *
# from fastai.vision.data import ImageDataLoaders


@api_view(["POST"])
def signUp(request):
    if request.method == 'POST':
        try:
            firebaseAuth = firebase.auth()
            data = request.data

            # Validation
            if (data["password"] != data["confirm_password"]):
                raise Exception(
                    "Password and confirm password should be the same")

            if (not all(v for v in data.values())):
                raise Exception("Please fill up all the data")

            db = firestore.client()
            collection_ref = db.collection('Users')

            if (data["role"] == "buyer"):
                # Add additional data to buyer
                data["profile_image_url"] = ""
                if(not "preferences" in data):
                    data["preferences"] = {
                        "condition": "",
                        "gender": "",
                        "price": [],
                        "size": ""
                    }

                data["verified_status"] = False
                data["premium_feature"] = False
                data["gender"] = ""
                data["phone_number"] = ""

                # Serialize
                buyerData = dict(data)

                serializer = BuyerSerializer(data=buyerData)

                if (serializer.is_valid()):
                    # Auth user first to get the user_id
                    authUser = firebaseAuth.create_user_with_email_and_password(
                        data["email"], data["password"])

                    # Send email verification
                    firebaseAuth.send_email_verification(authUser['idToken'])

                    # Store user to firestore
                    del data["password"]
                    del data["confirm_password"]
                    data["user_id"] = authUser["localId"]

                    collection_ref.document(authUser["localId"]).set(data)
                else:
                    raise Exception(serializer.errors)

            elif (data["role"] == "seller"):
                # Add additional data to seller
                data["verified_status"] = False
                data["profile_image_url"] = ""
                data["stripe_id"] = ""
                data["gender"] = ""
                data["business_profile"] = {
                    "business_name": "",
                    "business_description": "",
                    "business_type": "",
                    "location": "",
                    "contact_info": "",
                    "social_media_link": ""
                }

                # Serialize
                sellerData = dict(data)

                name = sellerData.pop("name")
                businessProfile = sellerData.pop("business_profile")

                sellerData.update(businessProfile)
                sellerData.update(name)

                serializer = SellerSerializer(data=sellerData)

                if (serializer.is_valid()):
                    # Auth user first to get the user_id
                    authUser = firebaseAuth.create_user_with_email_and_password(
                        data["email"], data["password"])

                    # Send email verification
                    firebaseAuth.send_email_verification(authUser['idToken'])

                    # Store user to firestore
                    del data["password"]
                    del data["confirm_password"]
                    data["user_id"] = authUser["localId"]

                    collection_ref.document(authUser["localId"]).set(data)
                else:
                    fieldNames = []
                    for errorField, error in serializer.errors.items():
                        fieldNames.append(errorField)

                    raise SerializerException(fieldNames)

            return JsonResponse({
                'status': "success",
                'message': "User registered successfully, please verify your email",
                "data": data
            }, status=200)

        except SerializerException as e:
            return JsonResponse({
                "status": "error",
                "message": f'Invalid data in {str(e)}'
            }, status=400)

        except Exception as e:
            if ("EMAIL_EXISTS" in str(e)):
                return JsonResponse({
                    "status": "error",
                    "message": "Email already exists, please use another one"
                }, status=400)

            if ("Enter a valid email address" in str(e)):
                return JsonResponse({
                    "status": "error",
                    "message": "Email is not valid"
                }, status=400)

            if ("WEAK_PASSWORD : Password should be at least 6 characters" in str(e)):
                return JsonResponse({
                    "status": "error",
                    "message": "Password should be at least 6 characters"
                }, status=400)

            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def signIn(request):
    if request.method == "POST":
        try:
            firebaseAuth = firebase.auth()

            data = request.data

            # Validation
            if (not all(v for v in data.values())):
                raise Exception("Please fill up all the data")
            regex = r"[^@]+@[^@]+\.[^@]+"

            if (not re.match(regex, data["email"]) is not None):
                raise Exception("Email is not valid")

            authUser = auth.get_user_by_email(data["email"])

            if (not authUser):
                raise Exception("User not found")

            if (authUser.disabled):
                raise Exception("User has been suspended/disabled")

            if (not authUser.email_verified):
                raise Exception("Please verify your email")

            user = firebaseAuth.sign_in_with_email_and_password(
                data["email"], data["password"])
            
            db = firestore.client()
            userRef = db.collection("Users").document(user["localId"])
            userData = userRef.get()

            responseData = dict(user)
            responseData["role"] = (userData.to_dict())["role"]

            return JsonResponse({
                'status': "success",
                'message': "Logged in Successful",
                'data': responseData
            }, status=200)

        except Exception as e:
            if ("INVALID_PASSWORD" in str(e)):
                return JsonResponse({
                    "status": "error",
                    "message": "Your password is incorrect"
                }, status=400)

            if ("Enter a valid email address" in str(e)):
                return JsonResponse({
                    "status": "error",
                    "message": "Email is not valid"
                }, status=400)

            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def recoverPassword(request):
    if request.method == "POST":
        try:
            firebaseAuth = firebase.auth()

            data = request.data

            validate_email(data["email"])

            resetPassword = firebaseAuth.send_password_reset_email(
                data["email"])

            resetPassword = firebaseAuth.send_password_reset_email(
                data["email"])

            return JsonResponse({
                'status': "success",
                'message': "Password reset link has been sent to your email",
                'data': resetPassword
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def verifyIdToken(request):
    if request.method == "POST":
        try:
            data = request.data
            verifyIdToken = auth.verify_id_token(data["idToken"])

            return JsonResponse({
                'status': "success",
                'message': "Password reset link has been sent to your email",
                'data': verifyIdToken
            }, status=200)

        except auth.RevokedIdTokenError:
            return JsonResponse({
                "status": "error",
                "message": "Token revoked. Please reauthenticate or sign out."
            }, status=401)

        except auth.UserDisabledError:
            return JsonResponse({
                "status": "error",
                "message": "Your account is disabled"
            }, status=401)

        except auth.InvalidIdTokenError:
            return JsonResponse({
                "status": "error",
                "message": "Invalid id token"
            }, status=400)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def retrieveUserInfoFromToken(request):
    if request.method == "POST":
        try:
            data = request.data

            verifyIdToken = auth.verify_id_token(data["firebaseIdToken"])

            db = firestore.client()
            docRef = db.collection("Users").document(verifyIdToken["uid"])

            user = (docRef.get()).to_dict()

            return JsonResponse({
                'status': "success",
                'message': "User session data is retrieved successfully",
                'data': user
            }, status=200)

        except auth.RevokedIdTokenError:
            return JsonResponse({
                "status": "error",
                "message": "Token revoked. Please reauthenticate or sign out."
            }, status=401)

        except auth.UserDisabledError:
            return JsonResponse({
                "status": "error",
                "message": "Your account is disabled"
            }, status=401)

        except auth.InvalidIdTokenError:
            return JsonResponse({
                "status": "error",
                "message": "Invalid id token"
            }, status=400)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def updateProfile(request):
    if request.method == "POST":
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


@api_view(["GET"])
def getAdvertisementListing(request):
    if request.method == "GET":
        try:
            db = firestore.client()
            itemRef = db.collection('Item')

            # Retrieving all item documents
            totalDocs = len(list(itemRef.stream()))

            # Generate 5 unique random offsets
            randomOffsets = random.sample(range(totalDocs), 5)

            randomDocuments = []
            for offset in randomOffsets:
                # Using offset and limit to paginate and fetch the specific document
                document = next(iter(itemRef.offset(offset).limit(1).stream()))
                randomDocuments.append(document.to_dict())

            return JsonResponse({
                'status': "success",
                'message': "Listing retrieve successfully",
                'data': randomDocuments
            }, status=200)
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def feedbackForm(request, user_id):
    if request.method == "POST":
        try:
            data = request.data

            # Check if account exists
            db = firestore.client()
            userRef = db.collection('Users').document(user_id)
            userDoc = userRef.get()

            if (not userDoc.exists):
                raise Exception("User not found")

            # Validation
            if (not all(v for v in data.values())):
                raise Exception("Please fill up all the data")

            # Serializer
            serializer = FeedbackSerializer(data=data)

            if (serializer.is_valid()):
                feedbackRef = db.collection('Feedback')  # create new ref
                feedbackForm = feedbackRef.add(data)

                return JsonResponse({
                    'status': "success",
                    'message': "Feedback Form updated successfully",
                }, status=200)
            else:
                raise Exception(serializer.errors)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["GET"])
def getListingDetailByItemId(request, item_id):
    if request.method == "GET":
        try:
            db = firestore.client()
            itemRef = db.collection("Item").document(item_id)
            itemData = itemRef.get()

            if (not itemData.exists):
                raise Exception("Item does not exists")

            # Retrieving listing id for collection address
            listingRef = db.collection("Listing").where(
                "item_id", "==", (itemData.to_dict())["item_id"]).limit(1)
            listingData = listingRef.get()

            if (len(listingData) <= 0):
                raise Exception("Listing does not exists")

            listingData = listingData[0]

            # Retrieving seller business profile for store name
            sellerRef = db.collection("Users").document(
                (itemData.to_dict())["user_id"])
            sellerData = (sellerRef.get())

            if (not sellerData.exists):
                raise Exception("Seller does not exists")

            if (sellerData.to_dict().get("business_profile") is None):
                raise Exception(
                    "This listing is not created using seller account")

            # Retrieving rating and calculate average rating
            reviewRef = db.collection("Review").where(
                "listing_id", "==", (listingData.to_dict())["listing_id"])
            reviewData = reviewRef.get()

            reviewList = []
            totalRating = 0

            for review in reviewData:
                reviewItem = {}

                buyerRef = db.collection("Users").document(
                    (review.to_dict())["buyer_id"])
                buyerData = buyerRef.get()

                if (not buyerData.exists):
                    raise Exception(
                        "Buyer data does not exists in the reviews")

                reviewItem["buyer_name"] = (buyerData.to_dict())[
                    "name"]["first_name"]
                reviewItem["buyer_image_profile"] = (buyerData.to_dict())[
                    "profile_image_url"]
                reviewItem["review_id"] = (review.to_dict())["review_id"]
                reviewItem["rating"] = (review.to_dict())["rating"]
                reviewItem["description"] = (review.to_dict())["description"]
                reviewItem["reply"] = (review.to_dict())["reply"]
                reviewItem["seller_id"] = (review.to_dict())["seller_id"]
                reviewItem["buyer_id"] = (review.to_dict())["buyer_id"]

                totalRating += int((review.to_dict())["rating"])
                reviewList.append(reviewItem)

            averageRating = 0
            if (len(reviewData) > 0):
                averageRating = totalRating // len(reviewData)

            responseData = {
                "listing_id": (listingData.to_dict())["listing_id"],
                "avail_status": (listingData.to_dict())["avail_status"],
                "title": (itemData.to_dict())["title"],
                "user_id": (itemData.to_dict())["user_id"],
                "item_id": (itemData.to_dict())["item_id"],
                "collection_address": (listingData.to_dict())["collection_address"],
                "size": (itemData.to_dict())["size"],
                "images": (itemData.to_dict())["image_urls"],
                "price": (itemData.to_dict())["price"],
                "quantity_available": (listingData.to_dict())["quantity_available"],
                "total_ratings": len(reviewList),
                "sold": 100,
                "store_name": (sellerData.to_dict())["business_profile"]["business_name"],
                "description": (itemData.to_dict())["description"],
                "average_rating": averageRating,
                "reviews": reviewList
            }

            return JsonResponse({
                'status': "success",
                'message': "Listing details retrieved successfully",
                'data': responseData
            }, status=200)
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["GET"])
def getAllItems(request):
    if request.method == "GET":
        try:
            db = firestore.client()
            itemRef = db.collection("Item")
            itemData = itemRef.get()

            responseData = []

            for item in itemData:
                responseData.append(item.to_dict())

            return JsonResponse({
                'status': "success",
                'message': "All items retrieved successfully",
                'data': responseData
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def getAllUsers(request):
    if request.method == "GET":
        try:
            db = firestore.client()
            userRef = db.collection("Users")
            userData = userRef.get()

            responseData = []

            for user in userData:
                responseData.append(user.to_dict())

            return JsonResponse({
                'status': "success",
                'message': "All users retrieved successfully",
                'data': responseData
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def getUserById(request, user_id):
    if request.method == "GET":
        try:
            if (len(user_id) <= 0):
                raise Exception("User id cannot be empty")

            db = firestore.client()
            userRef = db.collection("Users").document(user_id)
            userData = userRef.get()

            if (not userData.exists):
                raise Exception("User data does not exists")

            userData = userData.to_dict()

            return JsonResponse({
                'status': "success",
                'message': "User data retrieved successfully",
                'data': userData
            }, status=200)
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["GET"])
def getListingByItemId(request, item_id):
    if request.method == "GET":
        try:
            if (len(item_id) <= 0):
                raise Exception("Item id cannot be empty")

            db = firestore.client()
            listingRef = db.collection('Listing').where(
                'item_id', '==', item_id)
            listingData = listingRef.get()

            if (len(listingData) <= 0):
                raise Exception("Listing not found")

            listingData = listingData[0].to_dict()

            return JsonResponse({
                'status': "success",
                'message': "Listing data retrieved successfully",
                'data': listingData
            }, status=200)
        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["POST"])
def add_product(request):
    if request.method == "POST":
        try:
            firebaseStorage = firebase.storage()
            user_id = request.data.get("user_id")

            serializer = ItemSerializer(
                data=request.data)

            if serializer.is_valid():
                validated_data = serializer.validated_data
                gender = validated_data["gender"]
                category = validated_data["category"]
                sub_category = validated_data["sub_category"]
                condition = validated_data["condition"]
                colour = validated_data["colour"]
                title = validated_data["title"]
                description = validated_data["description"]
                price = validated_data["price"]
                size = validated_data["size"]
                uploaded_files = request.FILES.getlist('files')

                size_list = [s.strip() for s in size.split(",")]

                image_urls = []

                for uploaded_file in uploaded_files:
                    content_type = uploaded_file.content_type
                    file_extension = os.path.splitext(uploaded_file.name)[1]
                    unique_filename = f"{uuid.uuid4().hex}{file_extension}"

                    file_content = ContentFile(uploaded_file.read())

                    # Upload file to Firebase Storage
                    firebaseStorage.child(
                        f"{unique_filename}").put(file_content, content_type=content_type)

                    # Generate public image URL
                    image_url = firebaseStorage.child(
                        f"{unique_filename}").get_url(None)
                    image_urls.append(image_url)

                # Save data to Firestore
                db = firestore.client()
                products_ref = db.collection("Item")
                item_id = products_ref.document()
                item_id.set({
                    "item_id": item_id.id,
                    "gender": gender,
                    "category": category,
                    "sub_category": sub_category,
                    "condition": condition,
                    "colour": colour,
                    "title": title,
                    "description": description,
                    "price": price,
                    "image_urls": image_urls,
                    "user_id": user_id,
                    "size": size_list
                })

                collection_address = request.data.get("collection_address")
                quantity_available = request.data.get("quantity_available")
                avail_status = request.data.get("avail_status")

                if collection_address:
                    listing_ref = db.collection("Listing")
                    listing_id = listing_ref.document()
                    listing_id.set({
                        "quantity_available": quantity_available,
                        "avail_status": avail_status,
                        "listing_id": listing_id.id,
                        "collection_address": collection_address,
                        "item_id": item_id.id,
                    })

                return Response({"message": "Item added successfully"})
            else:
                return Response({"errors": serializer.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# GET All


@api_view(["GET"])
def get_all_item(request):
    if request.method == "GET":
        try:
            db = firestore.Client()
            products_ref = db.collection("Item")
            products = products_ref.stream()

            products_data = []

            for product in products:
                product_data = product.to_dict()
                products_data.append(product_data)

            return Response(products_data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

 # Get by User ID


@api_view(["GET"])
def get_by_sellerId(request, user_id):
    if request.method == "GET":
        try:
            db = firestore.Client()
            products_ref = db.collection(
                "Item").where("user_id", "==", user_id)
            products = products_ref.stream()

            products_data = []

            for product in products:
                product_data = product.to_dict()
                products_data.append(product_data)

            return Response(products_data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def get_seller_and_item(request, user_id, item_id):
    if request.method == "GET":
        try:
            db = firestore.Client()
            item_query = db.collection("Item").where(
                "user_id", "==", user_id).where("item_id", "==", item_id)
            item_results = item_query.stream()

            listing_query = db.collection(
                "Listing").where("item_id", "==", item_id)
            listing_results = listing_query.stream()

            item = {}

            # Iterate through the "Item" collection results and add them to the combined "Item" object
            for item_result in item_results:
                item_result_data = item_result.to_dict()
                item.update(item_result_data)

            # Iterate through the "Listing" collection results and add them to the combined "Item" object
            for listing_result in listing_results:
                listing_result_data = listing_result.to_dict()
                item.update(listing_result_data)

            return Response(item)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        

@api_view(["PUT"])
def update_seller_preferences(request, user_id):
    if request.method == "PUT":
        try:
            db = firestore.Client()

            user_ref = db.collection("Users").document(user_id)
            user_doc = user_ref.get()

            if not user_doc.exists:
                return Response({"message": "User not found"}, status=404)

            seller_preferences = request.data.get("seller_preferences", {})

            user_ref.update({
                "seller_preferences": seller_preferences,
            })

            return Response({"message": "Seller preferences updated successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)



@api_view(["PUT"])
def edit_item(request, user_id, item_id):
    if request.method == "PUT":
        try:
            db = firestore.Client()
            firebaseStorage = firebase.storage()

            products_ref = db.collection("Item").where(
                "user_id", "==", user_id).where("item_id", "==", item_id)
            products = products_ref.stream()

            matching_products = list(products)
            if len(matching_products) == 0:
                return Response({"message": "Product not found"}, status=404)

            product_doc = matching_products[0].reference

            serializer = EditItemSerializer(data=request.data, partial=True)
                    

            if serializer.is_valid():
                validated_data = serializer.validated_data

                size = validated_data.get("size", [])
                if size:
                    size = [s.strip() for s in size]
                
                product_doc.update({
                        "category": validated_data["category"],
                        "condition": validated_data["condition"],
                        "colour": validated_data["colour"],
                        "title": validated_data["title"],
                        "gender": validated_data["gender"],
                        "description": validated_data["description"],
                        "price": validated_data["price"],
                        "size": size,

                    })

              


                collection_address = request.data.get("collection_address")
                quantity_available = request.data.get("quantity_available")
                avail_status = request.data.get("avail_status")

                listing_ref = db.collection("Listing")
                listing_query = listing_ref.where("item_id", "==", item_id)
                listing_documents = listing_query.stream()

                for listing_doc in listing_documents:
                    listing_doc.reference.update({
                        "collection_address": collection_address,
                        "quantity_available": quantity_available,
                        "avail_status": avail_status,
                    })
               
                uploaded_files = request.FILES.getlist('files')

                image_urls = []

                for uploaded_file in uploaded_files:
                    content_type = uploaded_file.content_type
                    file_extension = os.path.splitext(uploaded_file.name)[1]
                    unique_filename = f"{uuid.uuid4().hex}{file_extension}"

                    file_content = ContentFile(uploaded_file.read())

                    # Upload file to Firebase Storage
                    firebaseStorage.child(
                        f"{unique_filename}").put(file_content, content_type=content_type)

                    # Generate public image URL
                    image_url = firebaseStorage.child(
                        f"{unique_filename}").get_url(None)
                    image_urls.append(image_url)

                    product_doc.update({
                        "image_urls": image_urls,
                    })

                return Response({"message": "Product updated successfully"})
            else:
                return Response({"errors": serializer.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)




@api_view(["PUT"])
def replace_image(request, id, item_id, index):
    if request.method == "PUT":
        try:
            db = firestore.Client()
            firebaseStorage = firebase.storage()

            products_ref = db.collection("Item").where(
                "user_id", "==", id).where("item_id", "==", item_id)
            items = list(products_ref.stream())

            if not items:
                return Response({"message": "Product not found"}, status=404)

            item = items[0]

            if int(index) < 0 or int(index) >= len(item.get("image_urls")):
                return Response({"message": "Invalid image index"}, status=400)

            uploaded_file = request.FILES.get('image')

            if uploaded_file:
                content_type = uploaded_file.content_type
                file_extension = os.path.splitext(uploaded_file.name)[1]
                unique_filename = f"{uuid.uuid4().hex}{file_extension}"

                file_content = ContentFile(uploaded_file.read())

                firebaseStorage.child(
                    f"{unique_filename}").put(file_content, content_type=content_type)

                # Generate public image URL
                image_url = firebaseStorage.child(
                    f"{unique_filename}").get_url(None)

                # Replace the image URL in the item's image_urls list
                item_image_urls = item.get("image_urls")
                item_image_urls[int(index)] = image_url

                # Create a new document reference and set the updated data
                item.reference.set({
                    "image_urls": item_image_urls
                }, merge=True)

                return Response({"message": "Image updated successfully", "imageUrl": image_url})

            return Response({"message": "No image was provided for update"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)






@api_view(["DELETE"])
def delete_item(request, user_id, item_id):
    if request.method == "DELETE":
        try:
            db = firestore.Client()
            products_ref = db.collection("Item").where(
                "user_id", "==", user_id).where("item_id", "==", item_id)
            products = products_ref.stream()

            matching_products = list(products)
            if len(matching_products) == 0:
                return Response({"message": "Product not found"}, status=404)

            product_doc = matching_products[0].reference
            product_doc.delete()

            listing_ref = db.collection("Listing").where(
                "item_id", "==", item_id)
            listing_documents = listing_ref.stream()

            for listing_doc in listing_documents:
                listing_doc.reference.delete()

            return Response({"message": "Product deleted successfully"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


model_path = './ML/stage-1_resnet34.pkl'
#update pkl file live
class_labels_path = './ML/class.txt'

with open(class_labels_path, 'r') as f:
    class_labels = f.read().splitlines()

model = torch.load(model_path, map_location=torch.device('cpu'))
model.eval()


@api_view(["POST"])
@parser_classes([MultiPartParser])
def classify_image(request):
    try:
        db = firestore.Client()
        uploaded_image = request.data['image']

        image = Image.open(uploaded_image)

        if image.mode != 'RGB':
            image = image.convert('RGB')

        image = image.resize((224, 224))
        image = np.array(image) / 255.0
        image_tensor = torch.tensor(
            image.transpose(2, 0, 1), dtype=torch.float32)
        image_tensor = image_tensor.unsqueeze(0)

        with torch.no_grad():
            outputs = model(image_tensor)

        _, predicted_idx = torch.max(outputs, 1)
        predicted_class = class_labels[predicted_idx]

        fashion_category_ref = db.collection("FashionCategory")
        query = fashion_category_ref.where("category", "==", predicted_class).limit(1)
        results = query.stream()

        predicted_subcategory = "Unknown" 

        for result in results:
            data = result.to_dict()
            predicted_subcategory = data.get("sub_category", "Unknown")

        response_data = {"predicted_class": predicted_class,
                         "predicted_subcategory": predicted_subcategory}
        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



@api_view(["GET"])
def get_subcategories(request):
    category = request.query_params.get("category")

    if not category:
        return Response({"error": "Category parameter is missing"}, status=400)

    try:
        db = firestore.Client()
        categories_ref = db.collection("FashionCategory")

        query = categories_ref.where("category", "==", category)
        sub_category = []

        for doc in query.stream():
            data = doc.to_dict()
            sub_category.append(data.get("sub_category"))

        return Response({"subcategory": sub_category})  

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def get_all_categories(request):
    try:
        db = firestore.Client()
        categories_ref = db.collection("FashionCategory")
        query = categories_ref.stream()

        all_categories = []

        for doc in query:
            data = doc.to_dict()
            all_categories.append({
                "category": data.get("category"),
                "sub_category": data.get("sub_category")
            })

        return Response({"categories": all_categories})

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def save_user_categories(request):
    if request.method == "POST":
        try:
            user_id = request.data.get("user_id")

            serializer = CategorySelectionSerializer(
                data=request.data
            )

            if serializer.is_valid():
                selected_categories = serializer.validated_data.get(
                    "selected_categories")

                db = firestore.client()

                user_ref = db.collection("User").document(user_id)

                user_ref.update({
                    "seller_preferences": selected_categories
                })

                return Response({"message": "Selected categories saved successfully"})
            else:
                return Response({"errors": serializer.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def addReview(request):
    if request.method == "POST":
        try:
            data = request.data

            if(len(data["paid_order_id"]) <= 0):
                raise Exception("Paid order id cannot be empty")

            if(data["rating"] == 0):
                raise Exception("Rating cannot be empty")

            serializer = ReviewSerializer(data=data)

            if(serializer.is_valid()):
                db = firestore.client()
                reviewId = (db.collection("Review").document()).id
                reviewRef = db.collection("Review").document(reviewId)

                data["review_id"] = reviewId

                reviewRef.set(data)

                paidOrderRef = db.collection(
                    "PaidOrder").document(data["paid_order_id"])
                paidOrderRef.update({"rated": True})

                return JsonResponse({
                    'status': "success",
                    'message': "Review submitted successfully",
                    'data': data
                }, status=200)
            else:
                raise Exception(serializer.errors)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["PUT"])
def updatePaidOrderStatus(request, paid_order_id):
    if request.method == "PUT":
        try:
            data = request.data

            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").document(paid_order_id)
            paidOrderData = paidOrderRef.get()

            if(not paidOrderData.exists):
                raise Exception("Paid order does not exists")

            if(data["status"] == "waiting for collection"):
                paidOrderRef.update({"status": data["status"]})

                return JsonResponse({
                    'status': "success",
                    'message': "Order status changed successfully",
                    'data': {
                        "status": data["status"]
                    }
                }, status=200)

            elif(data["status"] == "completed"):
                userRef = db.collection("Users").document(
                    (paidOrderData.to_dict())["seller_id"])
                userData = userRef.get()

                if(not userData.exists):
                    raise Exception("Seller order does not exists")

                itemRef = db.collection("Item").document(
                    (paidOrderData.to_dict())["checkout_data"]["item_id"])
                itemData = itemRef.get()

                if(not itemData.exists):
                    raise Exception("Item order does not exists")

                stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"

                price = (itemData.to_dict())["price"]
                quantity = (paidOrderData.to_dict())[
                    "checkout_data"]["quantity"]

                transferAmount = round(float(price) * int(quantity) * 0.95, 2)
                transferAmountInCents = int(transferAmount * 100)
                platformFee = round(float(price) * int(quantity) * 0.05, 2)

                transfer = stripe.Transfer.create(
                    amount=transferAmountInCents,
                    currency="sgd",
                    source_transaction=(paidOrderData.to_dict())["charge_id"],
                    destination=(userData.to_dict())["stripe_id"],
                )

                paidOrderRef.update({"status": data["status"]})

                return JsonResponse({
                    'status': "success",
                    'message': "Order status changed successfully",
                    'data': {
                        "status": data["status"],
                        "transfer_amount": transferAmount,
                        "transfer_destination": transfer["destination"],
                        "platform_fee": platformFee
                    }
                }, status=200)
            else:
                raise Exception("Unknown order status")

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)
        
@api_view(["POST"])
def webhookStripe(request):
    if request.method == "POST":
        try:
            payload = request.body
            event = None

            stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"
            endpointSecret = "whsec_55LxoMXRzZ1YahRk9hw4titHnVLl6B64"

            sig_header = request.META['HTTP_STRIPE_SIGNATURE']
            
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpointSecret
            )

            if event.type == 'checkout.session.completed':
                data = event.data.object

                paymentIntent = data["payment_intent"]
                buyerId = data["metadata"]["buyer_id"]
                createdAt = data["metadata"]["created_at"]
                checkoutData = json.loads(data["metadata"]["checkout_data"])
                #chargeId = (stripe.PaymentIntent.retrieve(paymentIntent)).charges.data[0].id

                chargeId = stripe.PaymentIntent.retrieve(paymentIntent)["charges"]["data"][0]["id"]
                receiptUrl = stripe.PaymentIntent.retrieve(paymentIntent)["charges"]["data"][0]["receipt_url"]

                responseData = []

                for checkoutItem in checkoutData:
                    db = firestore.client()
                    
                    listingId = checkoutItem["id"]
                    listingRef = db.collection("Listing").document(checkoutItem["id"])
                    listingData = listingRef.get()

                    if(not listingData.exists):
                        raise Exception(f"Listing ID {listingId} does not exists")
                    
                    itemId = (listingData.to_dict())["item_id"]
                    itemRef = db.collection("Item").document(itemId)
                    itemData = itemRef.get()

                    if(not itemData.exists):
                        raise Exception(f"Item ID {itemId} does not exists" )
                    
                    paidOrderId = (db.collection("PaidOrder").document()).id

                    paidOrderData = {
                        "paid_order_id": paidOrderId,
                        "receipt_url": receiptUrl,
                        "charge_id": chargeId,
                        "buyer_id": buyerId,
                        "seller_id": (itemData.to_dict())["user_id"],
                        "status": "paid",
                        "created_at": createdAt,
                        "rated": False,
                        "checkout_data": {
                            "listing_id": listingId,
                            "item_id": itemId,
                            "quantity": checkoutItem["q"],
                            "size": checkoutItem["s"]
                        }
                    }

                    paidOrderSerializer = PaidOrderSerializer(data=paidOrderData)
                    checkoutDataSerializer = CheckoutDataSerializer(data=paidOrderData["checkout_data"])

                    if(paidOrderSerializer.is_valid()):
                        if(checkoutDataSerializer.is_valid()):
                            paidOrderRef = db.collection("PaidOrder").document(paidOrderId)
                            paidOrderRef.set(paidOrderData)

                            updatedQuantityAvailable = int((listingData.to_dict())["quantity_available"]) - int(checkoutItem["q"])
                            listingRef.update({"quantity_available": updatedQuantityAvailable})
                            
                            responseData.append(paidOrderData)
                        else:
                            raise Exception(checkoutDataSerializer.errors)
                    
                    else:
                        raise Exception(paidOrderSerializer.errors)

                return JsonResponse({
                    'status': "success",
                    'message': "Paid order data saved successfully",
                    'data': responseData
                }, status=200)
                
        except Exception as e:
            print("ERROR WEBHOOK: ", str(e))
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)
