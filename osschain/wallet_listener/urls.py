from django.urls import path
from .views import receive_socket_data

urlpatterns = [
    path('receive/', receive_socket_data, name='receive_socket_data'),
]
