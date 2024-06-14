from django.urls import path
from .views import generate_crypto_12_word, create_wallet_addresses

urlpatterns = [
    path('generate-12-word/', generate_crypto_12_word, name='generate_crypto_12_word'),
    path('create-wallet-address/', create_wallet_addresses, name='create_wallet_addresses'),
]
