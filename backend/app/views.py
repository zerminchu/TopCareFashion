from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from rest_framework.views import APIView
from . models import *
from . serializer import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import firestore
from firebase_admin import storage
from firebase_admin import auth
from django.core.validators import validate_email
from django.core.files.storage import FileSystemStorage
from config.firebase import firebase
import pyrebase
import json
import base64


# class UserView(APIView):
#     def get(self, request):
#         output = [{"userType": output.userType, "dob": output.dob}
#                   for output in User.objects.all()]
#         return Response(output)

#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)

@api_view(["POST"])
def signUp(request):
    if request.method == 'POST':
        try:
            firebaseAuth = firebase.auth()
            data = request.data

            # Validation
            if(data["password"] != data["confirm_password"]):
                raise Exception("Password and confirm password should be the same")

            db = firestore.client()
            collection_ref = db.collection('Users')
            
            if(data["role"] == "buyer"):
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
                
                if(serializer.is_valid()):
                    # Auth user first to get the user_id
                    authUser = firebaseAuth.create_user_with_email_and_password(data["email"], data["password"])

                    # Send email verification
                    firebaseAuth.send_email_verification(authUser['idToken'])

                    # Store user to firestore
                    del data["password"]
                    del data["confirm_password"]
                    data["user_id"] = authUser["localId"]

                    collection_ref.document(authUser["localId"]).set(data)
                else:
                    raise Exception(serializer.errors)
                
            elif(data["role"] == "seller"):
                # Add additional data to seller
                data["verified_status"] = False
                data["profile_image"] = ""
                data["stripe_id"] = ""
                data["gender"] = ""
                data["business_profile"] = {
                    "business_name": "",
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

                if(serializer.is_valid()):
                    # Auth user first to get the user_id
                    authUser = firebaseAuth.create_user_with_email_and_password(data["email"], data["password"])

                    # Send email verification
                    firebaseAuth.send_email_verification(authUser['idToken'])

                    # Store user to firestore
                    del data["password"]
                    del data["confirm_password"]
                    data["user_id"] = authUser["localId"]

                    collection_ref.document(authUser["localId"]).set(data)
                else:
                    raise Exception(serializer.errors)

            return JsonResponse({
                'status': "success",
                'message': "User registered successfully, please verify your email",
                "data": data
            }, status=200)
        
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
            authUser = auth.get_user_by_email(data["email"])

            if(not authUser):
                raise Exception("User not found")
            
            if(not authUser.email_verified):
                raise Exception("Please verify your email")

            user = firebaseAuth.sign_in_with_email_and_password(data["email"], data["password"])

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
            
            resetPassword = firebaseAuth.send_password_reset_email(data["email"])
            
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
        
@api_view(["GET"])
def signOut(request):
    if request.method == "GET":
        try:
            # print("test here")
            # firebaseAuth = firebase.auth().current_user
            # print(firebaseAuth)
            
            return JsonResponse({
                'status': "success",
                'message': "Password reset link has been sent to your email",
                'data': "test"
            }, status=200)

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

            if(serializer.is_valid()):
                # User want to update profile image
                if(profile_image):
                    # Validate file format
                    allowed_formats = ['image/jpeg', 'image/jpg', 'image/png']
                    if profile_image.content_type not in allowed_formats:
                        raise Exception("Invalid file format. Only PNG, JPEG, and JPG formats are allowed.")

                    # Upload the file to Firebase Storage
                    firebaseStorage.child(f"UserProfile/{user_id}").put(profile_image)

                    # Generate public image url
                    profile_image = firebaseStorage.child(f"UserProfile/{user_id}").get_url(None)

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

                    updatedData = {
                        "name.first_name": first_name,
                        "name.last_name": last_name,
                        "gender": gender
                    }
                    print("here")

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
            # Deserialize both product and file data
            serializer = ProductSerializer(data=request.data)
            serializer_image = FileUploadSerializer(data=request.data)

            if serializer.is_valid() and serializer_image.is_valid():
                validated_data = serializer.validated_data
                name = validated_data["name"]
                price = float(validated_data["price"])

                uploaded_file = serializer_image.validated_data['file']

                bucket = storage.bucket()
                blob = bucket.blob(uploaded_file.name)

                content_type = 'image/png'
                blob.upload_from_file(uploaded_file, content_type=content_type)

                # Get the download URL of the uploaded image
                image_url = blob.public_url

                # Save data to Firestore
                db = firestore.client()
                products_ref = db.collection("products")
                new_product_ref = products_ref.add({
                    "name": name,
                    "price": price,
                    "image_url": image_url,
                })
                return Response({"message": "Product added successfully"})
            else:
                return Response({"errors": serializer.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)





""" 
@api_view(["POST"])
def upload_file(request):
    if request.method == 'POST':
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            uploaded_file = serializer.validated_data['file']

            try:
                bucket = storage.bucket()
                blob = bucket.blob(uploaded_file.name)
                content_type = 'image/png'

                blob.upload_from_file(uploaded_file, content_type=content_type)

                return Response({'message': 'File uploaded successfully'})
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        else:
            return Response({'errors': serializer.errors}, status=400)

    return Response({'message': 'File upload failed'}, status=400)
 """
