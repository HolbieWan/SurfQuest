from rest_framework import viewsets
from .models import Continent, Country, SurfZone, SurfSpot, SurfSpotImage, SurfZoneImage
from .serializers import ContinentSerializer, CountrySerializer, SurfZoneSerializer, SurfSpotSerializer, SurfSpotImageSerializer, SurfZoneImageSerializer


class ContinentViewSet(viewsets.ModelViewSet):
    queryset = Continent.objects.all()
    serializer_class = ContinentSerializer


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class SurfZoneViewSet(viewsets.ModelViewSet):
    queryset = SurfZone.objects.all()
    serializer_class = SurfZoneSerializer


class SurfSpotViewSet(viewsets.ModelViewSet):
    queryset = SurfSpot.objects.all()
    serializer_class = SurfSpotSerializer


class SurfSpotImageViewSet(viewsets.ModelViewSet):
    queryset = SurfSpotImage.objects.all()
    serializer_class = SurfSpotImageSerializer


class SurfZoneImageViewSet(viewsets.ModelViewSet):
    queryset = SurfZoneImage.objects.all()
    serializer_class = SurfZoneImageSerializer
