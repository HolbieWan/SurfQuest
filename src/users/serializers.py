from .models import User
from rest_framework import serializers


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

    def create(self, validated_data):
        # remove password from validated_data
        password = validated_data.pop('password', None)

        # create user with the remaining fields
        user = User(**validated_data)

        # If password was provided, set it securely
        if password is not None:
            user.set_password(password)

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