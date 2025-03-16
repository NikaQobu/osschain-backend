from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('generate_crypto_12_word', views.generate_crypto_12_word, name='generate_crypto_12_word'),
    path('create-wallet-address', views.create_wallet_addresses, name='create_wallet_addresses'),
]
