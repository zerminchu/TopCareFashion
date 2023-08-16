from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . models import User
from . serializer import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import firestore
from firebase_admin import storage


class UserView(APIView):
    def get(self, request):
        output = [{"userType": output.userType, "dob": output.dob}
                  for output in User.objects.all()]
        return Response(output)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


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
