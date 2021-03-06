"""visage_tome URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from .views import VisageTomeAPIView

urlpatterns = [
    # root
    path('schema/', SpectacularAPIView.as_view(), name='open-schema'),
    path('', SpectacularSwaggerView.as_view(
        url_name='open-schema'), name='api-root'),

    # post app
    path('posts/', include('posts.urls')),

    # post app
    path('users/', include('users.urls')),

    # admin
    path('admin/', admin.site.urls),
    path('tagging/', include('tagging.urls')),

    path('api/', VisageTomeAPIView.as_view(), name='visage-tome-generic')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
