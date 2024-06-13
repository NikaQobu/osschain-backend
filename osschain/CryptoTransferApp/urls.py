from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [ 
    path('calculate_chain_gas_price', views.calculate_chain_gas_price, name="calculate_chain_gas_price"),   
    path('calculate_token_gas_price', views.calculate_token_gas_price, name="calculate_token_gas_price"),   
    path('crypto_chain_transfer', views.crypto_chain_transfer, name="crypto_chain_transfer"),   
    path('crypto_token_transfer', views.crypto_token_transfer, name="crypto_token_transfer"),   
]
