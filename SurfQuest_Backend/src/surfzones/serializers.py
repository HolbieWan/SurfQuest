from rest_framework import serializers
from .models import Continent, Country, SurfZone, SurfSpot, SurfZoneImage, SurfSpotImage

class ContinentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Continent
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class SurfZoneImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurfZoneImage
        fields = '__all__'


class SurfZoneSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    zone_images = SurfZoneImageSerializer(many=True, read_only=True)
    class Meta:
        model = SurfZone
        fields = '__all__'


class SurfSpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurfSpot
        fields = '__all__'


class SurfSpotImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurfSpotImage
        fields = '__all__'