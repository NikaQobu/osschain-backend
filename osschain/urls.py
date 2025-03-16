from django.contrib import admin
from django.urls import path, include
from NFTApi import urls
from QueryApi import urls
from TokenApi import urls
from TransfersApp import urls
from WalletApp import urls
from WalletListenerApp import urls
from SwapApp import urls
from Accounts import urls


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('NFTApi.urls')),
    path('', include('QueryApi.urls')),
    path('', include('TokenApi.urls')),
    path('', include('TransfersApp.urls')),
    path('', include('WalletApp.urls')),
    path('', include('WalletListenerApp.urls')),
    path('', include('SwapApp.urls')),
    path('', include('Accounts.urls')),
]