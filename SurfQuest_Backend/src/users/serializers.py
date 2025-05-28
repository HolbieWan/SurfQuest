"""
Serializers for the users app.

This module defines how User and Review model instances are serialized and validated
for use in the SurfQuest API. It handles user creation, password validation and hashing,
as well as linking user reviews to surf zones and surf spots.
"""

# ============================
# Django & DRF Imports
# ============================
from rest_framework import serializers   # Django REST Framework base serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

# ============================
# Local Application Imports
from .models import User, Review

# ============================
# External App Imports
# ============================
from surfzones.models import SurfZone, SurfSpot
from surfzones.serializers import SurfZoneSerializer, SurfSpotSerializer


# ============================
# Serializers:
# ============================
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.

    Handles password validation, hashing, and user creation/update logic.
    """
    class Meta:
        model = User
        fields = (
            'id', 
            'username', 
            'password', 
            'email', 
            'first_name',
            'last_name',
            'country', 
            'state', 
            'city', 
            'zip_code', 
            'latitude', 
            'longitude', 
            'nearest_airport', 
            'bio', 
            'avatar',
            'preferences', 
            'budget',
        )
        extra_kwargs = {
            'password': {'write_only': True}  # Hide password from GET: Ensure password is only writable, never readable
        }


    def validate(self, attrs):
        """
        Validate password using Django's password validators.
        """
        password = attrs.get('password')
        if password:
            try:
                validate_password(password)
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages})
        return attrs


    def create(self, validated_data):
        """
        Create user with a hashed password.
        """
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # Use Django's hashing method
        user.save()
        return user


    def update(self, instance, validated_data):
        """
        Update user fields and handle password hashing if updated.
        """
        password = validated_data.pop('password', None)

        for key, value in validated_data.items():
            setattr(instance, key, value)

        if password is not None:
            instance.set_password(password)

        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for Review model.

    Validates uniqueness of review per user and surf zone/spot.
    Allows linking to surf zones and surf spots via ID, and includes nested details.
    """
    user = UserSerializer(read_only=True)

    # Allow setting surf zone ID when creating a review
    surf_zone = serializers.PrimaryKeyRelatedField(
        queryset=SurfZone.objects.all(), write_only=True, required=False, allow_null=True
    )
    # Allow setting surf spot ID when creating a review
    surf_spot = serializers.PrimaryKeyRelatedField(
        queryset=SurfSpot.objects.all(), write_only=True, required=False, allow_null=True
    )
    # Nested serializers for surf zone and surf spot details
    # These are read-only fields that will be populated in the response
    surf_zone_details = SurfZoneSerializer(source="surf_zone", read_only=True) 
    surf_spot_details = SurfSpotSerializer(source="surf_spot", read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}   # User is set automatically, so it's read-only

    def validate(self, data):
        """
        Prevent users from submitting multiple reviews for the same zone or spot.
        Allows updates to existing reviews.
        """
        request = self.context.get("request")
        user = request.user if request else None
        surf_zone = data.get("surf_zone")
        surf_spot = data.get("surf_spot")

        if not surf_zone and not surf_spot:
            instance = getattr(self, 'instance', None)
            if not instance or (not instance.surf_zone and not instance.surf_spot):
                raise serializers.ValidationError("You must provide either a surf zone or a surf spot.")
        
        if request and request.method in ['POST', 'PUT', 'PATCH']:
            existing_review = Review.objects.filter(user=user, surf_zone=surf_zone, surf_spot=surf_spot)

            # Exclude the current review if it's an update
            review_id = None
            if hasattr(request, 'parser_context'):
                review_id = request.parser_context['kwargs'].get('pk')  # Get review ID from URL
                existing_review = existing_review.exclude(id=review_id)

            if existing_review.exists():
                raise serializers.ValidationError("You have already reviewed this surf-zone or surf-spot")
        
        return data

    def create(self, validated_data):
        """
        Create review instance linking to surf zone and/or surf spot.
        """
        surf_zone = validated_data.pop('surf_zone', None)
        surf_spot = validated_data.pop('surf_spot', None)
        review = Review.objects.create(surf_zone=surf_zone, surf_spot=surf_spot , **validated_data)
        return review


    def update (self, instance, new_data):
        """
        Update review instance with new surf zone/spot or content.
        """
        instance.surf_zone = new_data.get('surf_zone', instance.surf_zone)
        instance.surf_spot = new_data.get('surf_spot', instance.surf_spot)
        instance.rating = new_data.get('rating', instance.rating)
        instance.comment = new_data.get('comment', instance.comment)

        instance.save()
        return instance
