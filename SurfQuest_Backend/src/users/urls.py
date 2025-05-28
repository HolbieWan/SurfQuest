"""
URL configuration for the `users` app.

This sets up API routes for user-related operations including user management, 
reviews, and protected routes using Django REST Framework ViewSets and APIViews.
"""

# ============================
# Django Imports
# ============================
from django.conf import settings   # Import Django project settings (e.g., MEDIA_URL, MEDIA_ROOT)
from django.urls import path, include   # Import functions to define URL patterns in Django
from django.conf.urls.static import static   # Used to serve media files during development

# ============================
# Third-Party Imports
# ============================
from rest_framework.routers import DefaultRouter   # Import DRF's router to automatically generate API routes for ViewSets

# ============================
# Local Application Imports
# ============================
from .views import UserViewSet, ProtectedView, ReviewViewSet, UserReviewsViewSet, UserDetailView   # Import views and ViewSets for users and reviews


# ============================
# DRF Router Setup
# ============================
router = DefaultRouter()   # Create a default DRF router instance
router.register(r'users', UserViewSet)   # Register user endpoints (e.g., /users/, /users/<id>/)
router.register(r'reviews', ReviewViewSet)   # Register review endpoints (e.g., /reviews/, /reviews/<id>/)
router.register(r'user-reviews', UserReviewsViewSet, basename='user-reviews')   # Register custom view for listing reviews by user

# ============================
# URL Patterns
# ============================
urlpatterns = [
    path('', include(router.urls)),   # Include all ViewSet-generated routes
    path('users/<slug:slug>/', UserDetailView.as_view(), name='user-detail-slug'),   # Detail view for user profile by slug
    path('protected-endpoint/', ProtectedView.as_view(), name='protected-endpoint'),   # Protected endpoint accessible with valid token
]

# ============================
# Media File Serving (Only in Development)
# ============================
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   # Allow serving uploaded media files via Django in development