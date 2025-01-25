from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import surfZoneViewSet, surfSpotViewSet


router = DefaultRouter()
router.register(r'surfzones', surfZoneViewSet)
router.register(r'surfspots', surfSpotViewSet)

urlpatterns = [
    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)