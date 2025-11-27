from django.db import models
from apps.events.models import Event
from apps.attendees.models import Attendee

class Certificate(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='certificates')
    attendee = models.ForeignKey(Attendee, on_delete=models.CASCADE, related_name='certificates')
    certificate_number = models.CharField(max_length=255, unique=True)
    issued_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('event', 'attendee')
    
    def __str__(self):
        return f"{self.certificate_number} - {self.attendee}"
