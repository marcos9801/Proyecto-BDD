# clientes/urls.py
from django.urls import path
from .views import productos    

urlpatterns = [
    #
    path('', productos),
    #path('anadir', ),
    #path('eliminar', ),
    #path('editar', )
]