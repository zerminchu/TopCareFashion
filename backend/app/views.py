from django.shortcuts import render
from . models import *
from . serializer import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import firestore
from firebase_admin import storage


@api_view(["POST"])
def add_product(request):
    if request.method == "POST":
        try:
            # Deserialize both product and file data
            serializer = ItemSerializer(data=request.data)

            if serializer.is_valid():
                validated_data = serializer.validated_data
                category = validated_data["category"]
                condition = validated_data["condition"]
                colour = validated_data["colour"]

                # price = float(validated_data["price"])

                uploaded_file = serializer.validated_data['file']

                bucket = storage.bucket()
                blob = bucket.blob(uploaded_file.name)

                content_type = 'image/png'
                blob.upload_from_file(uploaded_file, content_type=content_type)

                # Get the download URL of the uploaded image
                image_url = blob.public_url

                # Save data to Firestore
                db = firestore.client()
                products_ref = db.collection("Item")
                products_ref.add({
                    "category": category,
                    "condition": condition,
                    "colour": colour,
                    "image_url": image_url,
                })
                return Response({"message": "Item added successfully"})
            else:
                return Response({"errors": serializer.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
