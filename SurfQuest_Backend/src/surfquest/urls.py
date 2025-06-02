"""
URL configuration for surfquest project.

This defines the top-level routing for Django, mapping URLs to views.
"""

#===========================================
# Django Imports
#===========================================
from django.contrib import admin   # Admin interface for managing the application
from django.conf.urls.static import static   # Static file serving utility
from django.urls import path, include   # URL routing utilities

#===========================================
# Django Rest Framework Imports
#===========================================
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView   # JWT token views from Django REST Framework SimpleJWT

# ============================
# Main URL Patterns
# ============================
urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin panel

    # JWT Authentication endpoints
    path('api/login/', TokenObtainPairView.as_view(), name='obtain_token_pair'),     # Login: get access + refresh token
    path('api/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),    # Refresh the access token

    # Application-specific endpoints (users, surfzones, conditions)
    path('api/v1/', include('users.urls')),         # Routes for user operations
    path('api/v1/', include('surfzones.urls')),     # Routes for surf zones
    path('api/v1/', include('conditions.urls')),    # Routes for surf conditions
]

# ============================
# Media File Serving (Only in Development)
# ============================

# Serve user-uploaded media files through Django when DEBUG is True
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)