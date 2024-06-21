# wallet_listener/signals.py
from django.core.management import call_command
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def start_websocket_listener(sender, **kwargs):
    print("Signal 'post_migrate' received, starting WebSocket listener...")
    call_command('listen_wallet')
