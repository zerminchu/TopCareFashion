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

import pyrebase
import json
import base64
import os
import uuid

import tensorflow as tf
from PIL import Image
import numpy as np


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

            if (data["password"] != data["confirm_password"]):
                raise Exception(
                    "Password and confirm password should be the same")

            db = firestore.client()
            collection_ref = db.collection('Users')

            if (data["role"] == "buyer"):
                # Add additional data to buyer
                data["profile_image_url"] = ""
                data["preferences"] = {
                    "colour": "",
                    "size": "",
                    "category": ""
                }
                data["verified_status"] = False
                data["gender"] = ""

                # Serialize
                buyerData = dict(data)

                preferences = buyerData.pop("preferences")
                name = buyerData.pop("name")

                buyerData.update(preferences)
                buyerData.update(name)
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

            # Validate data to produce custom message
            validate_email(data["email"])

            authUser = auth.get_user_by_email(data["email"])

            if (not authUser):
                raise Exception("User not found")

            if (not authUser.email_verified):
                raise Exception("Please verify your email")

            user = firebaseAuth.sign_in_with_email_and_password(
                data["email"], data["password"])

            return JsonResponse({
                'status': "success",
                'message': "User login successfully",
                'data': user
            }, status=200)

        except Exception as e:
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

            # Serializer
            serializer = UpdateProfileSerializer(data=data)

            if (serializer.is_valid()):
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

                # Update data into firestore
                collectionRef = db.collection('Users').document(user_id)
                collectionRef.update(updatedData)

                print(updatedData)

            else:
                raise Exception(serializer.errors)

            return JsonResponse({
                'status': "success",
                'message': "User profile updated successfully",
                'data': {
                    "updatedFirstName": first_name,
                    "updatedLastName": last_name,
                    "updatedProfileImage": profile_image,
                    "updatedGender": gender
                }
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
                category = validated_data["category"]
                condition = validated_data["condition"]
                colour = validated_data["colour"]
                title = validated_data["title"]
                description = validated_data["description"]
                price = validated_data["price"]
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

                    # Upload file to Firebase storage

                    """   bucket = storage.bucket()
                    blob = bucket.blob(unique_filename)
                    blob.upload_from_file(
                        file_content, content_type=content_type)

                    # Get the download URL of the uploaded image
                    image_url = blob.public_url
                    image_urls.append(image_url) """

                # Save data to Firestore
                db = firestore.client()
                products_ref = db.collection("Item")
                item_id = products_ref.document()
                item_id.set({
                    "item_id": item_id.id,
                    "category": category,
                    "condition": condition,
                    "colour": colour,
                    "title": title,
                    "description": description,
                    "price": price,
                    "image_urls": image_urls,
                    "user_id": user_id
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
    print(f"Received user_id: {user_id}")  # Add this line for debugging

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


# IMAGE CLASSIFICATION
model = tf.keras.models.load_model(
    './ML/clothing_classification_model.h5')


@api_view(["POST"])
def classify_image(request):
    if request.method == "POST":
        try:
            uploaded_file = request.FILES.get('image')

            print(uploaded_file)
            # Open and preprocess the uploaded image
            image = Image.open(uploaded_file)
            # Resize to match model input size
            image = image.resize((224, 224))
            image = np.array(image) / 255.0  # Normalize pixel values
            image = np.expand_dims(image, axis=0)  # Add batch dimension

            # Run the image through the model for classification
            prediction = model.predict(image)
            predicted_class = int(np.argmax(prediction, axis=1))

            return JsonResponse({"category": predicted_class})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        

