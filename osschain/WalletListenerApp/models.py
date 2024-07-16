
from django.db import models

class PushInfo(models.Model):
    wallet_address = models.CharField(max_length=100)
    push_token = models.CharField(max_length=100)

    def __str__(self):
        return self.wallet_address  # Return a string representation of the model instance
