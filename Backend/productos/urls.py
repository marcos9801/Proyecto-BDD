# clientes/urls.py
from django.urls import path
from .views import productos, anadir_producto, eliminar_producto, modificar_producto, categorias    

urlpatterns = [
    path('', productos),
    path('anadir', anadir_producto),
    path('eliminar', eliminar_producto),
    path('editar', modificar_producto),
    path('categorias', categorias),
]
