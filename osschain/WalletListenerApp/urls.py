# WalletListenerApp/urls.py

from django.urls import path, include
from . import views, routing

urlpatterns = [
    path('subscribe_to_wallet', views.subscribe_to_wallet, name='subscribe_to_wallet'),
    path('tatum_webhook', views.tatum_webhook, name='tatum_webhook'),
    path('get_last_transactions', views.get_last_transactions, name='get_last_transactions'),
    path('get_push_info', views.get_push_info, name='get_push_info'),
]
