# clientes/urls.py
from django.urls import path
from .views import apartados, anadir_apartado, eliminar_apartado, actualizar_apartado
urlpatterns = [
    path('', apartados),
    path('anadir', anadir_apartado),
    path('eliminar', eliminar_apartado),
    path('editar', actualizar_apartado)
    
]