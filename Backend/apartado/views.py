from django.http import JsonResponse
from .models import Apartado
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import ApartadoSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from  rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
# Create your views here.
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#consulta de productos
def apartados(request):
    data = []
    id=request.GET.get('id') if 'id' in request.GET else None
    if id == None:
        productos= Apartado.objects.all()
        serializer=ApartadoSerializer(productos, many=True)
    else:
        producto=get_object_or_404(Apartado, id=id)
        serializer=ApartadoSerializer(producto, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)
    