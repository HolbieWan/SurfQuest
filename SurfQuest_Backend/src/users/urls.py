from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProtectedView, debug_login

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('protected-endpoint/', ProtectedView.as_view(), name = 'protected-endpoint'),
    path('debug-login/', debug_login, name='debug-login'),
]