from django.http import JsonResponse
from .models import Venta, DetalleVenta
from django.db import transaction
from productos.models import  Producto
from clientes.models import Cliente
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import VentaSerializer, DetalleVentaSerializer, VentaSerializerEntrada
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from  rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from drf_yasg.utils import swagger_auto_schema
# Create your views here.
@swagger_auto_schema(method='GET', responses={200: VentaSerializer(many=True)})
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#consulta de productos
def ventas(request):
    data = []
    id=request.GET.get('id') if 'id' in request.GET else None
    if id == None:
        productos= Venta.objects.all()
        print(productos)
        serializer=VentaSerializer(productos, many=True)
    else:
        producto=get_object_or_404(Venta, id=id)
        serializer=VentaSerializer(producto, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
@swagger_auto_schema(method='POST', request_body=VentaSerializerEntrada, responses={201: VentaSerializer()})
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def anadir_venta(request):
    cliente_id = get_object_or_404(Cliente, id=request.data.get('cliente'))
    productos = request.data.get('productos')
    if not productos:
        return Response({'mensaje': 'No se han proporcionado productos'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = VentaSerializerEntrada(data=request.data)
    if serializer.is_valid():
        with transaction.atomic():
            venta = serializer.save()
            total = 0
            for producto_str in productos:
                producto_id, cantidad= map(float, producto_str.split(' - '))
                producto = get_object_or_404(Producto, id=producto_id)
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=producto,
                    cantidad=cantidad,
                    subtotal=cantidad * producto.precio
                )
                # Reducir el stock del producto
                producto.cantidad -= cantidad
                producto.save()
                total += cantidad * producto.precio
            # Actualizar el total del apartado
            venta.total = total
            venta.save()
            # Serializar el objeto apartado para la respuesta
            serializer = VentaSerializer(venta)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@swagger_auto_schema(method='DELETE', request_body={'id': 'int'}, responses={200: 'venta eliminado'})    
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminar_venta(request):

    id = request.data.get('id')
    if not id:
        return Response({'mensaje': 'No se ha proporcionado un id'}, status=status.HTTP_400_BAD_REQUEST)
    print(id)
    venta = get_object_or_404(Venta, id=id)
    productos = DetalleVenta.objects.filter(venta=venta)
    for producto in productos:
        producto.producto.cantidad += producto.cantidad
        producto.producto.save()
    venta.delete()
    return Response({'mensaje': 'venta eliminado'}, status=status.HTTP_200_OK)
@swagger_auto_schema(method='PUT', request_body=VentaSerializerEntrada, responses={200: VentaSerializer()})
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def actualizar_venta(request):
    id = request.data.get('id')
    if not id:
        return Response({'mensaje': 'No se ha proporcionado un id'}, status=status.HTTP_400_BAD_REQUEST)
    venta = get_object_or_404(Venta, id=id)
    productos = DetalleVenta.objects.filter(venta=venta)

    