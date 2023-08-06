from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . models import User
from . serializer import *
from rest_framework.response import Response


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
