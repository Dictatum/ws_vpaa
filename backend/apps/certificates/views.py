from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers import CertificateSerializer
from apps.events.models import Event

class CertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.request.query_params.get('event_id')
        if event_id:
            return Certificate.objects.filter(event_id=event_id)
        return Certificate.objects.all()
