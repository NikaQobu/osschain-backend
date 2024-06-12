from django.contrib import admin
from django.urls import path, include
from NFTApi import urls
from QueryApi import urls
from TokenApi import urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('NFTApi.urls')),
    path('', include('QueryApi.urls')),
    path('', include('TokenApi.urls'))
]