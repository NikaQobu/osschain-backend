from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('get_token_transfer', views.get_token_transfer, name="get_token_transfer"),
    path('get_transactions_by_address', views.get_transactions_by_address, name="get_transactions_by_address"),
]
