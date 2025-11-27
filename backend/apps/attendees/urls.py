from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendeeViewSet

router = DefaultRouter()
router.register(r'', AttendeeViewSet, basename='attendees')

urlpatterns = [
    path('', include(router.urls)),
]
