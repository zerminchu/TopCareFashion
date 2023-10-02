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
def getCheckoutLink(request):
    if request.method == "POST":
        try:
            data = request.data

            if (len(data["checkout"]) <= 0):
                raise Exception("Checkout should have at least 1 item")

            items = []

            for checkoutItem in data["checkout"]:
                item = {}

                if (len(checkoutItem["title"]) <= 0):
                    raise Exception("Product title should not be empty")

                if (checkoutItem["price"] <= 0):
                    raise Exception("Price should not be below 0")

                if (checkoutItem["quantity"] <= 0):
                    raise Exception("Quantity should not be below 0")

                if (isinstance(checkoutItem["quantity"], float)):
                    raise Exception("Quantity should be integer number")

                item = {
                    'price_data': {
                        'currency': 'sgd',
                        'product_data': {
                            'name': checkoutItem["title"],
                        },
                        # Amount in cents
                        'unit_amount': int(checkoutItem["price"] * 100),
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

            if (len(data["user_id"]) <= 0):
                raise Exception("User id cannot be blank")

            db = firestore.client()
            userRef = db.collection('Users').document(data["user_id"])
            user = userRef.get()

            if (not user.exists):
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

        # RATING


@api_view(["POST"])
def submit_review(request, user_id):
    try:
        data = request.data
        rating = data.get("rating")
        feedback = data.get("description")

        db = firestore.client()
        user_ref = db.collection('Users').document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise Exception("User not found")

        review_ref = db.collection('Review').document()
        review_data = {
            "rating": rating,
            "description": feedback,
            "buyer_id": user_id,
        }
        review_ref.set(review_data)

        # Respond with a success message
        return Response({"message": "Rating and feedback submitted successfully"}, status=200)
    except Exception as e:
        # Handle errors and respond with an error message
        return Response({"error": str(e)}, status=400)


""" @api_view(["GET"])
def getBuyerReviews(request, buyer_id):
    if request.method == "GET":
        try:
            db = firestore.client()
            reviewsRef = db.collection("Review").where(
                'buyer_id', '==', buyer_id)
            reviewData = reviewsRef.get()

            responseData = []

            for review in reviewData:
                responseData.append(review.to_dict())

            return JsonResponse({
                'status': "success",
                'message': f"Reviews for buyer {buyer_id} retrieved successfully",
                'data': responseData
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500) """


@api_view(["GET"])
def getReviews_buyer(request, user_id):
    if request.method == "GET":
        try:
            updatedReviews = []

            db = firestore.client()
            reviewRef = db.collection('Review').where(
                'buyer_id', '==', user_id)
            reviewData = reviewRef.stream()

            for doc in reviewData:
                eachReview = {}

                # Get user
                buyerRef = db.collection('Users').document(
                    (doc.to_dict())['buyer_id'])
                buyerData = (buyerRef.get()).to_dict()

                # Get listing
                listingRef = db.collection('Listing').document(
                    (doc.to_dict())['listing_id'])
                listingData = (listingRef.get()).to_dict()

                # Get item
                itemRef = db.collection('Item').document(
                    listingData['item_id'])
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
