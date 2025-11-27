from rest_framework import serializers
from .models import Attendee

class AttendeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Attendee
        fields = ['id', 'event', 'first_name', 'last_name', 'full_name', 'email', 'phone', 'status', 'check_in_time', 'created_at']
        read_only_fields = ['created_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()
