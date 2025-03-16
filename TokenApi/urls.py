from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
     path('get_account_balance', views.get_account_balance, name="get_account_balance"),
     path('get_custom_token_info', views.get_custom_token_info, name="get_custom_token_info"),
     
]
