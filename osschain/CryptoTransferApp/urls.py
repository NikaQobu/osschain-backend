from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('crypto_transfer', views.crypto_transfer, name="crypto_transfer"),
    
]
