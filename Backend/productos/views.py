from django.http import JsonResponse
from .models import Producto, Categoria
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from  rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import ProductoSerializer
from rest_framework.parsers import MultiPartParser, FormParser
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def categorias(request):
    categorias = Categoria.objects.all()
    data = []
    for categoria in categorias:
        data.append({
            'id': categoria.id,
            'nombre': categoria.nombre
        })
  
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#consulta de productos
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
    
#anadir producto
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def anadir_producto(request):    
    try:
        print(request)
        print(request.data)
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("ci")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminar_producto(request):
    id = request.data.get('id')
    if not id:
        return Response({'mensaje': 'No se ha proporcionado un id'}, status=status.HTTP_400_BAD_REQUEST)
    producto = get_object_or_404(Producto, id=id)
    producto.delete()
    return Response({'mensaje': 'Producto eliminado'}, status=status.HTTP_200_OK)
    

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def modificar_producto(request):
    id=request.data["id"]
    try:
        # Obtener el producto existente
        producto = get_object_or_404(Producto, id=id)
        if 'nombre' in request.data:
            producto.nombre = request.data['nombre']
        if 'descripcion' in request.data:
            producto.descripcion = request.data['descripcion']
        if 'precio' in request.data:
            producto.precio = request.data['precio']
        if "material" in request.data:
            producto.material = request.data['material']
        if "cantidad" in request.data:
            producto.cantidad =request.data['cantidad']
        if "categoria" in request.data:
            categoria = get_object_or_404(Categoria, id=request.data['categoria'])
            producto.categoria = categoria
        if 'imagen' in request.data:
            producto.imagen = request.data['imagen']
            
            
        producto.save()
        serializer = ProductoSerializer(producto)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
