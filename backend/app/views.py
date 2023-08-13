from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . models import User
from . serializer import *
from rest_framework.response import Response
from rest_framework.decorators import api_view
from firebase_admin import firestore


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
            serializer = ProductSerializer(data=request.data)
            if serializer.is_valid():
                validated_data = serializer.validated_data
                name = validated_data["name"]
                price = float(validated_data["price"])

                # Save data to Firestore
                db = firestore.client()
                products_ref = db.collection("products")
                products_ref.add({
                    "name": name,
                    "price": price,
                })

                return Response({"message": "Product added successfully"})
            else:
                return Response({"errors": serializer.errors}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
