from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('check_destroy_account/<str:wallet_address>', views.check_destroy_account, name='check_destroy_account'),
    path('destroy_account', views.destroy_account, name='destroy_account'),
]
