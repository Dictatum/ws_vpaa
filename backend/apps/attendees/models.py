from django.db import models
from django.utils import timezone
from apps.events.models import Event

class Attendee(models.Model):
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('checked_in', 'Checked In'),
        ('no_show', 'No Show'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    check_in_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('event', 'email')
        ordering = ['first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"
