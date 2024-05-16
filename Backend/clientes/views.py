from django.http import JsonResponse
from .models import Cliente, Direccion
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from  rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import ClienteSerializer
from drf_yasg.utils import swagger_auto_schema
@swagger_auto_schema(method='GET', responses={200: ClienteSerializer(many=True)})
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#consulta de clientes
def clientes(request):
    data = []
    id=request.GET.get('id') if 'id' in request.GET else None
    
    if not id:    
        clientes = Cliente.objects.all()
        serializer=ClienteSerializer(clientes, many=True)
        
    else:
        cliente = get_object_or_404(Cliente, id=id)
        serializer=ClienteSerializer(cliente, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
#anadir cliente

@swagger_auto_schema(method='POST', request_body=ClienteSerializer, responses={201: ClienteSerializer()})
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def anadir_cliente(request):
    print(request.data)
    nombre = request.data.get('nombre')
    correo = request.data.get('correo')
    telefono = request.data.get('telefono')
    if  request.data.get('direccion') is None:
        Cliente.objects.create(nombre=nombre, correo=correo, telefono=telefono)
        return Response({'mensaje': 'Cliente añadido'}, status=status.HTTP_201_CREATED)
    else:
        direccion = request.data.get('direccion')
        ciudad = request.data.get('ciudad')
        pais = request.data.get('pais')
        estado = request.data.get('estado')
        colonia = request.data.get('colonia')
        codigo_postal = request.data.get('codigo_postal')
        direc= Direccion.objects.create(direccion=direccion, ciudad=ciudad, pais=pais, estado=estado, codigo_postal=codigo_postal, colonia=colonia)
        cliente = Cliente.objects.create(nombre=nombre, correo=correo, telefono=telefono, direccion=direc)
        
        return Response({'mensaje': 'Cliente añadido con direccion'}, status=status.HTTP_201_CREATED)
#eliminar cliente

@swagger_auto_schema(method='DELETE', request_body=ClienteSerializer, responses={200: ClienteSerializer()})
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminar_cliente(request):
    id = request.data.get('id')
    if not id:
        return Response({'mensaje': 'No se ha proporcionado un id'}, status=status.HTTP_400_BAD_REQUEST)
    cliente = get_object_or_404(Cliente, id=id)
    cliente.delete()
    return Response({'mensaje': 'Cliente eliminado'}, status=status.HTTP_200_OK)
#actualizar cliente
@swagger_auto_schema(method='PUT', request_body=ClienteSerializer, responses={200: ClienteSerializer()})
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def modificar_cliente(request):
    print(request.data)
    id = request.data.get('id')
    print(request.data)
    print(id)
    cliente = get_object_or_404(Cliente, id=id)
    nombre = request.data.get('nombre')
    correo = request.data.get('correo')
    telefono = request.data.get('telefono')
    direccion = request.data.get('direccion')
    colonia = request.data.get('colonia')
    ciudad = request.data.get('ciudad')
    estado = request.data.get('estado')
    pais = request.data.get('pais')
    codigo_postal = request.data.get('codigo_postal')
    print (request.data)
    
    # Actualiza la información del cliente
    cliente.nombre = nombre
    cliente.correo = correo
    cliente.telefono = telefono
    
    # Actualiza la información de la dirección asociada (si existe)
    if Direccion.objects.filter(cliente=cliente).exists():
        direccion_existente = Direccion.objects.get(cliente=cliente)
        direccion_existente.direccion = direccion
        direccion_existente.ciudad = ciudad
        direccion_existente.colonia = colonia
        direccion_existente.estado = estado
        direccion_existente.pais = pais
        direccion_existente.codigo_postal = codigo_postal
        direccion_existente.colonia = colonia
        cliente.direccion = direccion_existente
        direccion_existente.save()

    else:
        x=Direccion.objects.create(cliente=cliente, direccion=direccion, ciudad=ciudad, colonia=colonia, estado=estado, pais=pais, codigo_postal=codigo_postal)
        cliente.direccion=x
        x.save()
    
    print(cliente.direccion)
    cliente.save()
        
    return Response({'mensaje': 'Cliente modificado'}, status=status.HTTP_200_OK)
