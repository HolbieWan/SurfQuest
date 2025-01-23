from rest_framework import viewsets 
from .models import User
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view 


class UserViewSet(viewsets.ModelViewSet):
    """Viewset for User model"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'list']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class ProtectedView(APIView):
    """View to test authentication"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected view"})


