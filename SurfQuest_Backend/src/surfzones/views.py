from rest_framework import viewsets
from .models import Continent, Country, SurfZone, SurfSpot, SurfSpotImage, SurfZoneImage
from .serializers import ContinentSerializer, CountrySerializer, SurfZoneSerializer, \
    SurfSpotSerializer, SurfSpotImageSerializer, SurfZoneImageSerializer
from rest_framework.permissions import IsAuthenticated


class surfZoneViewSet((viewsets.ModelViewSet)):
    """Viewset for SurfZone model"""
    queryset = SurfZone.objects.all()
    serializer_class = SurfZoneSerializer
    permission_classes = [IsAuthenticated]