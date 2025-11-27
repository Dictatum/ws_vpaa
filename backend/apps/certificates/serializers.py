from rest_framework import serializers
from .models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    attendee_name = serializers.CharField(source='attendee.get_full_name', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['id', 'event', 'event_name', 'attendee', 'attendee_name', 'certificate_number', 'issued_date']
        read_only_fields = ['issued_date']
