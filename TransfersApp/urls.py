from django.urls import path
from . import views

urlpatterns = [
    path('calculate_chain_gas_price', views.calculate_chain_gas_price, name='calculate_chain_gas_price'),
    path('calculate_token_gas_price', views.calculate_token_gas_price, name='calculate_token_gas_price'),
    path('calculate_nft_fee', views.calculate_nft_fee, name='calculate_nft_fee'),
    path('nft_transfer', views.nft_transfer, name='nft_transfer'),
    path('crypto_chain_transfer', views.crypto_chain_transfer, name='crypto_chain_transfer'),
    path('crypto_token_transfer', views.crypto_token_transfer, name='crypto_token_transfer'),
]
