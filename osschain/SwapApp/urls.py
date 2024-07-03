from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('swap_tokens', views.swap_tokens, name="swap_tokens"),
     
]
