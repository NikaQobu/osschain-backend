# WalletListenerApp/urls.py

from django.urls import path, include
from . import views, routing

urlpatterns = [
    path('subscribe_to_wallet', views.subscribe_to_wallet, name='subscribe_to_wallet'),
    path('tatum_webhook', views.tatum_webhook, name='tatum_webhook'),
    path('sse_view', views.sse_view, name='sse_view'),
]
