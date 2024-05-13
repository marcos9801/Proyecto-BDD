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
class ApartadoSerializerEntrada(serializers.ModelSerializer):
    class Meta:
        model = Apartado
        fields = 'fecha_apartado', 'status', 'fecha_limite'

class detallesApartadoSerializer(serializers.ModelSerializer): 
    fecha_apartado = serializers.DateField()
    status = serializers.IntegerField()
    fecha_limite = serializers.DateField()
    productos = serializers.ListField(child=serializers.CharField())

    def create(self, validated_data):
        productos_data = validated_data.pop('productos')
        apartado = Apartado.objects.create(**validated_data)
        for producto_str in productos_data:
            producto_id, cantidad, precio = map(float, producto_str.split(' - '))
            detallesApartado.objects.create(apartado=apartado, producto_id=producto_id, cantidad=cantidad, subtotal=cantidad * precio)
        return apartado
