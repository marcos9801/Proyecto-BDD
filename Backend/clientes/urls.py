# clientes/urls.py
from django.urls import path
from .views import clientes, anadir_cliente, eliminar_cliente, modificar_cliente

urlpatterns = [
    path('', clientes),
    path('anadir', anadir_cliente),
    path('eliminar', eliminar_cliente),
    path('editar', modificar_cliente)
]