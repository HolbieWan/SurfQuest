from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProtectedView, ReviewViewSet, UserReviewsViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'user-reviews', UserReviewsViewSet, basename='user-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('protected-endpoint/', ProtectedView.as_view(), name = 'protected-endpoint')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
