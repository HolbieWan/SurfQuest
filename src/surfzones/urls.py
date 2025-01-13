from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ContinentViewSet, CountryViewSet, SurfZoneViewSet, SurfSpotViewSet, SurfSpotImageViewSet, SurfZoneImageViewSet


router = DefaultRouter()
router.register(r'continents', ContinentViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'surfzones', SurfZoneViewSet)
router.register(r'surfspots', SurfSpotViewSet)
router.register(r'surfspot_images', SurfSpotImageViewSet)
router.register(r'surfzone_images', SurfZoneImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]