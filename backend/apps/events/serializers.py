from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    attendee_count = serializers.ReadOnlyField()
    checked_in_count = serializers.ReadOnlyField()
    creator_name = serializers.CharField(source='creator.full_name', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'organization', 'creator', 'creator_name',
            'event_date', 'start_time', 'end_time', 'location', 'max_attendees',
            'status', 'attendee_count', 'checked_in_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['creator', 'created_at', 'updated_at']
