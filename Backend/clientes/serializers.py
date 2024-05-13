from rest_framework import serializers
from .models import Cliente, Direccion

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer()

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'correo', 'telefono', 'direccion']
