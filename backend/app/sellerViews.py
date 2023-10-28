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


@api_view(["POST"])
def onBoarding(request):
    if request.method == "POST":
        try:
            data = request.data
            stripe.api_key = "sk_test_51LmU0QEDeJsL7mvQWznZX85lQ8T28onhbUw2otE3hnte3MeDZjNyYxjwbwIZhq2Cdp1vj4XfebLExzdxpQ64UHiV000sGoCmKR"

            if (data.get("user_id") is not None):
                # Validation
                if ((data["user_id"] == "")):
                    raise Exception("User id cannot be empty")

                # Create Stripe account
                createConnectedAccount = stripe.Account.create(type="standard")

                # Generate link for user to fill up information
                linkAccount = stripe.AccountLink.create(
                    account=createConnectedAccount.stripe_id,
                    refresh_url="http://localhost:5173/",
                    return_url="http://localhost:5173/",
                    type="account_onboarding",
                )

                # Store data to Firestore
                db = firestore.client()
                collection_ref = db.collection('Users')
                collection_ref.document(data["user_id"]).update(
                    {"stripe_id": createConnectedAccount.stripe_id})

                return JsonResponse({
                    'status': "success",
                    'message': "Link to onboard retrieved successfully",
                    'data': linkAccount
                }, status=200)

            elif (data.get("stripe_id") is not None):
                # Validation
                if ((data["stripe_id"] == "")):
                    raise Exception("Stripe ID cannot be empty")

                # Generate link for existing stripe account to fill up information
                linkExistingAccount = stripe.AccountLink.create(
                    account=data["stripe_id"],
                    refresh_url="http://127.0.0.1:5173/",
                    return_url="http://127.0.0.1:5173/",
                    type="account_onboarding",
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
            if (data["stripe_id"] == ""):
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
                'message': "Seller's details retrieved successfully",
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

            if (not userDoc.exists):
                raise Exception("User not found")

            # Validation
            if (not all(v for v in data.values())):
                raise Exception("Please fill up all the data")

            # Serializer
            serializer = SellerBusinessProfileSerializer(data=data)

            if (serializer.is_valid()):
                updateBusinessProfile = userRef.update(
                    {"business_profile": data})

                return JsonResponse({
                    'status': "success",
                    'message': "Business profile updated successfully",
                    'data': data
                }, status=200)
            else:
                raise Exception(serializer.errors)

        except Exception as e:
            if ("string='Enter a valid URL.', code='invalid'" in str(e)):
                return JsonResponse({
                    "status": "error",
                    "message": "Enter a valid URL for social media"
                }, status=400)

            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)


@api_view(["GET"])
def getReviews(request, user_id):
    if request.method == "GET":
        try:
            updatedReviews = []

            # Retrieve all reviews from seller id
            db = firestore.client()
            reviewRef = db.collection('Review').where(
                'seller_id', '==', user_id)
            reviewData = reviewRef.get()

            for doc in reviewData:
                eachReview = {}

                # Get user
                buyerRef = db.collection('Users').document(
                    (doc.to_dict())['buyer_id'])
                buyerData = buyerRef.get()

                if(not buyerData.exists):
                    continue

                # Get listing
                listingRef = db.collection('Listing').document(
                    (doc.to_dict())['listing_id'])
                listingData = listingRef.get()

                if(not listingData.exists):
                    continue

                # Get item
                itemRef = db.collection('Item').document(
                    (listingData.to_dict())['item_id'])
                itemData = itemRef.get()

                if(not itemData.exists):
                    continue

                eachReview['review_id'] = (doc.to_dict())['review_id']
                eachReview['product_name'] = (itemData.to_dict())['title']
                eachReview['rating'] = (doc.to_dict())['rating']
                eachReview['description'] = (doc.to_dict())['description']
                eachReview['listing_id'] = (doc.to_dict())['listing_id']
                eachReview['buyer_id'] = (doc.to_dict())['buyer_id']
                eachReview['buyer_name'] = (buyerData.to_dict())['name']['first_name']
                eachReview['seller_id'] = (doc.to_dict())['seller_id']
                eachReview['date'] = (doc.to_dict())['date']
                eachReview['reply'] = (doc.to_dict())['reply']

                updatedReviews.append(eachReview)

            ratingQuery = request.GET.get('rating', None)
            startDateQuery = request.GET.get('start-date', None)
            endDateQuery = request.GET.get('end-date', None)
            searchQuery = request.GET.get('search', None)

            # Apply filter
            if (ratingQuery is not None):
                updatedReviews = [
                    item for item in updatedReviews if item["rating"] == int(ratingQuery)]

            if (startDateQuery is not None):
                startDateObj = datetime.strptime(
                    startDateQuery, "%Y-%m-%d").date()

                updatedReviews = [
                    review for review in updatedReviews
                    if startDateObj <= datetime.strptime(review["date"], "%Y-%m-%d").date()
                ]

            if (endDateQuery is not None):
                endDateObj = datetime.strptime(endDateQuery, "%Y-%m-%d").date()

                updatedReviews = [
                    review for review in updatedReviews
                    if endDateObj >= datetime.strptime(review["date"], "%Y-%m-%d").date()
                ]

            if (searchQuery is not None):
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
            if (data["review_id"] == ""):
                raise Exception("Review ID cannot be empty")

            if (data["reply"] == ""):
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


@api_view(["GET"])
def getAllOrdersByUserId(request, user_id):
    if request.method == "GET":
        try:
            if (len(user_id) <= 0):
                raise Exception("User id cannot be empty")

            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").where(
                "seller_id", "==", user_id)
            paidOrderData = paidOrderRef.stream()

            paidOrderList = []

            for order in paidOrderData:
                # Check for buyer id
                buyerRef = db.collection("Users").document((order.to_dict())["buyer_id"])
                buyerData = buyerRef.get()
                
                if(not buyerData.exists):
                    continue
                
                # Check for seller id
                sellerRef = db.collection("Users").document((order.to_dict())["seller_id"])
                sellerData = sellerRef.get()

                if(not sellerData.exists):
                    continue
                
                # Check for listing id
                listingRef = db.collection("Listing").document((order.to_dict())["checkout_data"]["listing_id"])
                listingData = listingRef.get()

                if(not listingData.exists):
                    continue
                
                # Check for item id
                itemRef = db.collection("Item").document((order.to_dict())["checkout_data"]["item_id"])
                itemData = itemRef.get()

                if(not itemData.exists):
                    continue
              
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
            if (len(paid_order_id) <= 0):
                raise Exception("Paid order id cannot be empty")

            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").document(paid_order_id)
            paidOrderData = paidOrderRef.get()

            if (not paidOrderData.exists):
                raise Exception("Paid order data does not exists")

            itemRef = db.collection("Item").document(
                (paidOrderData.to_dict())["checkout_data"]["item_id"])
            itemData = itemRef.get()

            if (not itemData.exists):
                raise Exception("Item data does not exists")

            userRef = db.collection("Users").document(
                (paidOrderData.to_dict())["buyer_id"])
            userData = userRef.get()

            if (not userData.exists):
                raise Exception("User data does not exists")

            responseData = {
                "buyer_name": (userData.to_dict())["name"]["first_name"],
                "images": (itemData.to_dict())["image_urls"],
                "title": (itemData.to_dict())["title"],
                "category": (itemData.to_dict())["category"],
                "size": (paidOrderData.to_dict())["checkout_data"]["size"],
                "price": (itemData.to_dict())["price"],
                "status": (paidOrderData.to_dict())["status"],
                "quantity": (paidOrderData.to_dict())["checkout_data"]["quantity"]
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


def getSalesDetailsByUserId(request, user_id):
    if request.method == "GET":
        try:
            if (len(user_id) <= 0):
                raise Exception("User id cannot be empty")

            db = firestore.client()
            paidOrderRef = db.collection("PaidOrder").where(
                "seller_id", "==", user_id)
            paidOrderData = paidOrderRef.stream()

            preSalesData = []

            for order in paidOrderData:
                sale = {}

                itemRef = db.collection("Item").document(
                    (order.to_dict())["checkout_data"]["item_id"])
                itemData = itemRef.get()

                if(not itemData.exists):
                    continue

                sale["title"] = (itemData.to_dict())["title"]
                sale["quantity"] = (
                    (order.to_dict())["checkout_data"]["quantity"])
                sale["price"] = (itemData.to_dict())["price"]
                sale["status"] = ((order.to_dict())["status"])

                preSalesData.append(sale)

            summary = {}
            orderCompleted = 0
            totalRevenue = 0

            for item in preSalesData:
                title = item["title"]
                price = float(item["price"])
                quantity = int(item["quantity"])
                status = item["status"]

                if (status == "completed"):
                    orderCompleted += 1

                    if (title not in summary):
                        summary[title] = {"title": title,
                                          "sale": 0, "revenue": 0.00}

                    summary[title]["sale"] += quantity
                    summary[title]["revenue"] += (price * quantity)
                    totalRevenue += (price * quantity)

            responseData = list(summary.values())

            return JsonResponse({
                'status': "success",
                'message': "Sales data retrieved successfully",
                'data': {
                    "sales": responseData,
                    "total_revenue": totalRevenue,
                    "order_completed": orderCompleted
                }
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)

@api_view(["GET"])
def getAllListingBySellerId(request, seller_id):
    if request.method == "GET":
        try:
            if(len(seller_id) <= 0):
               raise Exception("Seller id cannot be empty")
            
            db = firestore.client()
            itemRef = db.collection('Item')

            query = itemRef.where('user_id', '==', seller_id).stream()

            responseData = []

            for doc in query:
                itemId = doc.to_dict()["item_id"]
                listingQuery = db.collection("Listing").where("item_id", "==", itemId).limit(1)
                listingQueryData = listingQuery.get()

                if(len(listingQueryData) <= 0):
                    return JsonResponse({
                        'status': "error",
                        'message': f"Listing with item id {itemId} does not exists"
                    }, status=400)
                
                if((listingQueryData[0].to_dict())["avail_status"] == "Available"):
                    responseData.append(doc.to_dict())

            return JsonResponse({
                'status': "success",
                'message': f"All listing by {seller_id} retrieved successfully",
                'data': responseData
            }, status=200)

        except Exception as e:
            return JsonResponse({
                "status": "error",
                "message": str(e)
            }, status=400)