from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [ 
    path('calculate_chain_gas_price', views.calculate_chain_gas_price, name="calculate_chain_gas_price"),   
    path('crypto_chain_transfer', views.crypto_chain_transfer, name="crypto_chain_transfer"),   
]
