"""
ViewSets and API views for the users app.

This module defines endpoints for user registration, user authentication testing,
and review creation and filtering based on the authenticated user.
"""

# ============================
# Django Imports
# ============================
from django.contrib.auth import authenticate   # Django login validation function

# ============================
# Django Rest Framework Imports
# ============================
from rest_framework import viewsets   # Base class for building ViewSets
from rest_framework.views import APIView   # Generic class-based API view
from rest_framework.response import Response   # Used to return API responses
from rest_framework.permissions import IsAuthenticated, AllowAny   # Access control
from rest_framework.decorators import api_view   # For function-based views (not used here)
from rest_framework.generics import RetrieveAPIView   # Add at the top with DRF imports

# ============================
# Local Application Imports
# ============================
from .models import User, Review
from .serializers import UserSerializer, ReviewSerializer


# ============================
# ViewSets and API Views
# ============================
class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the User model.

    Allows creation of new users (public) and retrieval/update/deletion of users (authenticated).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """
        Allow unauthenticated access to user registration and listing.
        All other actions require authentication.
        """
        if self.action in ['create', 'list']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class UserDetailView(RetrieveAPIView):
    """
    API view to retrieve a user's public profile using their slug.

    Useful for public profile pages.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    authentication_classes = []


class ProtectedView(APIView):
    """
    Simple protected view to test authentication.

    Returns a message only if the user is authenticated.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected view"})


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the Review model.

    Allows authenticated users to read and create reviews.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']   # Restrict to GET and POST only

    def perform_create(self, serializer):
        """
        Automatically assign the authenticated user when creating a review.
        """
        serializer.save(user=self.request.user)


class UserReviewsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for accessing and managing the authenticated user's own reviews.

    Allows retrieval, update, and deletion of reviews made by the current user.
    """
    serializer_class = ReviewSerializer 
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'delete']   # Restrict to GET, PUT, DELETE only
    
    def get_queryset(self):
        """
        Filter the queryset to only include reviews by the current authenticated user.
        """
        return Review.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """
        Ensure the created review is tied to the authenticated user.
        """
        serializer.save(user=self.request.user)
