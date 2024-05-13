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
#Del apartado de ventas
from . import views

urlpatterns = [
    path('ventas/', views.lista_ventas, name='lista_ventas'),
    path('venta/<int:id>/', views.detalle_venta, name='detalle_venta'),
    path('productos/', views.lista_productos, name='lista_productos'),
    path('producto/<int:id>/', views.detalle_producto, name='detalle_producto'),
]
