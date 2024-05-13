from django.urls import path
from . import views

urlpatterns = [
    path('ventas/', views.lista_ventas, name='lista_ventas'),
    path('venta/<int:id>/', views.detalle_venta, name='detalle_venta'),
    path('productos/', views.lista_productos, name='lista_productos'),
    path('producto/<int:id>/', views.detalle_producto, name='detalle_producto'),
]
