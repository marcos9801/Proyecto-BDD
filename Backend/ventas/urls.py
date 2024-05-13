from django.urls import path
from .views import ventas, anadir_venta, eliminar_venta, actualizar_venta

urlpatterns = [
    path('', ventas),
    path('anadir', anadir_venta),
    path('eliminar', eliminar_venta),
    path('editar', actualizar_venta)
]
