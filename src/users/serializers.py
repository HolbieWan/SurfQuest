from .models import User
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


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
        """
        This is an optional extra step if you want to validate the password
        before you even call create().
        """
        password = attrs.get('password')
        if password:
            try:
                validate_password(password)  # This applies the built-in validators
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)  # This also handles hashing
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