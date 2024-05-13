from rest_framework import serializers
from .models import Venta, DetalleVenta

class ProductoField(serializers.RelatedField):
    def to_representation(self, value):
        return f"{value.id} - {value.nombre} - {value.cantidad}" 

class VentaSerializer(serializers.ModelSerializer):
    productos = ProductoField(many=True, read_only=True)
    cliente = serializers.StringRelatedField()
    class Meta:
        model = Venta
        fields = '__all__'

class VentaSerializerEntrada(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = 'cliente', 'fecha_venta'

class DetalleVentaSerializer(serializers.ModelSerializer): 
    class Meta:
        model = DetalleVenta
        fields = '__all__'

class VentaSerializerWithDetails(serializers.ModelSerializer):
    productos = ProductoField(many=True, read_only=True)
    cliente = serializers.StringRelatedField()
    detalles = DetalleVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'

class VentaSerializerForCreation(serializers.ModelSerializer):
    productos = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Venta
        fields = 'cliente', 'fecha_venta', 'productos'

    def create(self, validated_data):
        productos_data = validated_data.pop('productos')
        venta = Venta.objects.create(**validated_data)
        for producto_str in productos_data:
            producto_id, cantidad, precio = map(float, producto_str.split(' - '))
            DetalleVenta.objects.create(venta=venta, producto_id=producto_id, cantidad=cantidad, subtotal=cantidad * precio)
        return venta
