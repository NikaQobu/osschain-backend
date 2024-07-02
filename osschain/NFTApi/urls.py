from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
     path('get_nft_metadata', views.get_nft_metadata, name="get_nft_metadata"),
     path('get_nft_by_owner', views.get_nft_by_owner, name="get_nft_by_owner"),
     path('get_nft_transfers', views.get_nft_transfers, name="get_nft_transfers"),
]
