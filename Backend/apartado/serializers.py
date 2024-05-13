from rest_framework import serializers
from .models import Apartado, detallesApartado

class ProductoField(serializers.RelatedField):
    def to_representation(self, value):
        return f"{value.id} - {value.nombre} - {value.cantidad}" 

class ApartadoSerializer(serializers.ModelSerializer):
    productos = ProductoField(many=True, read_only=True)
    
    class Meta:
        model = Apartado
        fields = '__all__'

class detallesApartadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = detallesApartado
        fields = '__all__'
