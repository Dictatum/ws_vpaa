from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Attendee
from .serializers import AttendeeSerializer

class AttendeeViewSet(viewsets.ModelViewSet):
    serializer_class = AttendeeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.request.query_params.get('event_id')
        if event_id:
            return Attendee.objects.filter(event_id=event_id).order_by('first_name')
        return Attendee.objects.all().order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        attendee = self.get_object()
        attendee.status = 'checked_in'
        attendee.check_in_time = timezone.now()
        attendee.save()
        return Response(AttendeeSerializer(attendee).data)
