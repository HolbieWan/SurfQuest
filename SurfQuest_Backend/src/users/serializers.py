from .models import User, Review
from surfzones.models import SurfZone
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from surfzones.serializers import SurfZoneSerializer


class UserSerializer(serializers.ModelSerializer):
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
            'password': {'write_only': True}  # Hide password from GET
        }


    def validate(self, attrs):
        password = attrs.get('password')
        if password:
            try:
                validate_password(password)
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages})
        return attrs


    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # handles hashing
        user.save()
        return user


    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for key, value in validated_data.items():
            setattr(instance, key, value)

        if password is not None:
            instance.set_password(password)

        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    surf_zone = serializers.PrimaryKeyRelatedField(
        queryset=SurfZone.objects.all(), write_only=True
    )
    surf_zone_details = SurfZoneSerializer(source="surf_zone", read_only=True) 
    class Meta:
        model = Review
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}} 

    def validate(self, data):
        """Prevents user from submitting multiple reviews for the same SurfZone or SurfSpot, but allows updates."""
        request = self.context.get("request")
        user = request.user if request else None
        surf_zone = data.get("surf_zone")
        surf_spot = data.get("surf_spot")
        
        # If this is an update, exclude the current review from duplicate check
        if request and request.method in ['POST', 'PUT', 'PATCH']:
            existing_review = Review.objects.filter(user=user, surf_zone=surf_zone, surf_spot=surf_spot)

            # Exclude the current review if it's an update
            if request.method in ['PUT', 'PATCH'] and request.parser_context:
                review_id = request.parser_context['kwargs'].get('pk')  # Get review ID from URL
                existing_review = existing_review.exclude(id=review_id)

            if existing_review.exists():
                raise serializers.ValidationError("You have already reviewed this surf-zone or surf-spot")
        
        return data

    def create(self, validated_data):
        surf_zone = validated_data.pop('surf_zone', None)
        surf_spot = validated_data.pop('surf_spot', None)
        review = Review.objects.create(surf_zone=surf_zone, surf_spot=surf_spot , **validated_data)
        return review


    def update (self, instance, new_data):
        instance.surf_zone = new_data.get('surf_zone', instance.surf_zone)
        instance.surf_spot = new_data.get('surf_spot', instance.surf_spot)
        instance.rating = new_data.get('rating', instance.rating)
        instance.comment = new_data.get('comment', instance.comment)

        instance.save()
        return instance
