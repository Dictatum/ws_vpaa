from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    organization = models.CharField(max_length=255, default='VPAA')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    event_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=255, blank=True)
    max_attendees = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-event_date']
    
    def __str__(self):
        return self.name
    
    @property
    def attendee_count(self):
        return self.attendees.count()
    
    @property
    def checked_in_count(self):
        return self.attendees.filter(status='checked_in').count()
