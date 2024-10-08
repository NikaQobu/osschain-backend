from django.db import models

class DestroyAccounts(models.Model):
    wallet_address = models.CharField(max_length=100)
    