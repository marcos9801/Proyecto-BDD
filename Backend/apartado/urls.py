# clientes/urls.py
from django.urls import path
from .views import apartados
urlpatterns = [
    path('', apartados),
    
    #path('anadir', anadir_cliente),
    #path('eliminar', eliminar_cliente),
    #path('editar', modificar_cliente)
    
]