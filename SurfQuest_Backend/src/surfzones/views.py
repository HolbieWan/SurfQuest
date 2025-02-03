from rest_framework import viewsets
from .models import SurfZone, SurfSpot
from .serializers import SurfZoneSerializer, SurfSpotSerializer
from rest_framework.permissions import IsAuthenticated


class surfZoneViewSet((viewsets.ModelViewSet)):
    """Viewset for SurfZone model"""
    queryset = SurfZone.objects.all()
    serializer_class = SurfZoneSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']


class surfSpotViewSet(viewsets.ModelViewSet):
    """ViewSet for SurfSpot model"""
    queryset = SurfSpot.objects.all()
    serializer_class = SurfSpotSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
