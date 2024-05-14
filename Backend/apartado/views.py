from django.http import JsonResponse
from .models import Apartado, detallesApartado
from django.db import transaction
from productos.models import  Producto
from clientes.models import Cliente
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import ApartadoSerializer, detallesApartadoSerializer, ApartadoSerializerEntrada
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from  rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from drf_yasg.utils import swagger_auto_schema

# Create your views here.
@swagger_auto_schema(method='GET', responses={200: ApartadoSerializer(many=True)})
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#consulta de productos
def apartados(request):
    data = []
    id=request.GET.get('id') if 'id' in request.GET else None
    if id == None:
        productos= Apartado.objects.all()
        print(productos)
        serializer=ApartadoSerializer(productos, many=True)
    else:
        producto=get_object_or_404(Apartado, id=id)
        serializer=ApartadoSerializer(producto, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
@swagger_auto_schema(method='POST', request_body=ApartadoSerializerEntrada, responses={201: ApartadoSerializer()})
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def anadir_apartado(request):
    cliente_id = get_object_or_404(Cliente, id=request.data.get('cliente'))
    productos = request.data.get('productos')
    if not productos:
        return Response({'mensaje': 'No se han proporcionado productos'}, status=status.HTTP_400_BAD_REQUEST)
    serializer = ApartadoSerializerEntrada(data=request.data)
    if serializer.is_valid():
        with transaction.atomic():
            apartado = serializer.save()
            total = 0
            for producto_str in productos:
                producto_id, cantidad= map(float, producto_str.split(' - '))
                producto = get_object_or_404(Producto, id=producto_id)
                detallesApartado.objects.create(
                    apartado=apartado,
                    producto=producto,
                    cantidad=cantidad,
                    subtotal=cantidad * producto.precio
                )
                # Reducir el stock del producto
                producto.cantidad -= cantidad
                producto.save()
                total += cantidad * producto.precio
            # Actualizar el total del apartado
            apartado.total = total
            apartado.save()
            # Serializar el objeto apartado para la respuesta
            serializer = ApartadoSerializer(apartado)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@swagger_auto_schema(method='DELETE', request_body={'id': 'int'}, responses={200: 'apartado eliminado'})
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminar_apartado(request):
    id = request.data.get('id')
    if not id:
        return Response({'mensaje': 'No se ha proporcionado un id'}, status=status.HTTP_400_BAD_REQUEST)
    print(id)
    apartado = get_object_or_404(Apartado, id=id)
    productos = detallesApartado.objects.filter(apartado=apartado)
    for producto in productos:
        producto.producto.cantidad += producto.cantidad
        producto.producto.save()
    apartado.delete()
    return Response({'mensaje': 'apartado eliminado'}, status=status.HTTP_200_OK)

@swagger_auto_schema(method='PUT', request_body={'id': 'int'}, responses={200: 'apartado actualizado'})
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def actualizar_apartado(request):
    id = request.data.get('id')
    if not id:
        return Response({'mensaje': 'No se ha proporcionado un id'}, status=status.HTTP_400_BAD_REQUEST)
    apartado = get_object_or_404(Apartado, id=id)
    productos = detallesApartado.objects.filter(apartado=apartado)

    