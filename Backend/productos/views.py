from django.http import JsonResponse
from .models import Producto, Categoria
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from  rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import ProductoSerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#consulta de clientes
def productos(request):
    data = []
    id=request.GET.get('id') if 'id' in request.GET else None
    if id == None:
        productos= Producto.objects.all()
        serializer=ProductoSerializer(productos, many=True)
    else:
        producto=get_object_or_404(Producto, id=id)
        serializer=ProductoSerializer(producto, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
#anadir cliente
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def anadir_producto(request):
    x=1
    
#eliminar cliente
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminar_producto(request):
    x=1
    

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def modificar_producto(request):
    x=1
    
