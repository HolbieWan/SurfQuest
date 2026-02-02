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
from rest_framework.generics import RetrieveAPIView   # Add at the top with DRF imports
from rest_framework import status   # HTTP status codes

# ============================
# Local Application Imports
# ============================
from .models import User, Review
from .serializers import UserSerializer, ReviewSerializer, ReviewReadLiteSerializer, ReviewWriteSerializer


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


class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ReviewReadLiteSerializer

    queryset = Review.objects.select_related("user", "surf_zone", "surf_spot").order_by("-created_at")

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        surf_zone_id = p.get("surf_zone_id")
        if surf_zone_id:
            qs = qs.filter(surf_zone_id=surf_zone_id)

        surf_spot_id = p.get("surf_spot_id")
        if surf_spot_id:
            qs = qs.filter(surf_spot_id=surf_spot_id)

        return qs


class UserReviewsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewReadLiteSerializer
    http_method_names = ["get", "post", "put", "patch", "delete"]

    def get_queryset(self):
        return (
            Review.objects
            .filter(user=self.request.user)
            .select_related("user", "surf_zone", "surf_spot")
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return ReviewWriteSerializer
        return ReviewReadLiteSerializer
    
    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        review = write_serializer.save()

        read_serializer = ReviewReadLiteSerializer(review, context={"request": request})
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        write_serializer = self.get_serializer(instance, data=request.data)
        write_serializer.is_valid(raise_exception=True)
        review = write_serializer.save()

        read_serializer = ReviewReadLiteSerializer(review, context={"request": request})
        return Response(read_serializer.data, status=status.HTTP_200_OK)
