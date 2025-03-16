
from django.db import models
from django.utils import timezone

class PushInfo(models.Model):
    wallet_address = models.CharField(max_length=100)
    push_token = models.CharField(max_length=100)

    def __str__(self):
        return self.wallet_address  # Return a string representation of the model instance
    
class Transactions(models.Model):
    data = models.JSONField()  # Using JSONField to store arbitrary data
    sender = models.BooleanField()  # Boolean field to indicate if the entity is a sender
    receiver = models.BooleanField()  # Boolean field to indicate if the entity is a receiver
    sender_address = models.CharField(max_length=255)  # CharField for sender address
    receiver_address = models.CharField(max_length=255)  # CharField for receiver address
    time = models.DateTimeField(default=timezone.now)  # DateTimeField for the transaction time

    def __str__(self):
        return f'Transaction from {self.sender_address} to {self.receiver_address} at {self.time}'
    

