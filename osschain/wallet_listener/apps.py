from django.apps import AppConfig
from django.core.management import call_command
from threading import Thread

def start_listener():
    call_command('listen_wallet')

class WalletListenerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wallet_listener'

    def ready(self):
        print("App is ready, starting WebSocket listener...")
        listener_thread = Thread(target=start_listener)
        listener_thread.daemon = True
        listener_thread.start()
