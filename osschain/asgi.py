# osschain/asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from osschain.consumers import WalletConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'osschain.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/wallet/', WalletConsumer.as_asgi()),
        ])
    ),
})
