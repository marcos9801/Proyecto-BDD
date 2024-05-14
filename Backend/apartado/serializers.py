from rest_framework import serializers
from .models import Apartado, detallesApartado
from productos.models import Producto

class ProductoField(serializers.RelatedField):
    def to_representation(self, value):
        return f"{value.id} - {value.nombre}" 
class detallesApartadoSerializer(serializers.ModelSerializer):
    fecha_apartado = serializers.DateField()
    status = serializers.IntegerField()
    fecha_limite = serializers.DateField()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        productos_data = instance.productos_apartados.all()
        productos_list = []
        for producto_data in productos_data:
            producto_str = f"{producto_data.producto.id} - {producto_data.producto.nombre} - Cantidad: {producto_data.cantidad}"
            productos_list.append(producto_str)
        representation['productos'] = productos_list
        return representation
    class Meta:
        model = Apartado
        fields = 'cliente', 'fecha_apartado', 'status', 'fecha_limite', 'productos'

    def create(self, validated_data):
        productos_data = validated_data.pop('productos')
        apartado = Apartado.objects.create(**validated_data)
        for producto_str in productos_data:
            producto_id, cantidad = producto_str.split(' - ')
            producto = Producto.objects.get(id=producto_id)
            detallesApartado.objects.create(apartado=apartado, producto=producto, cantidad=int(cantidad))
        return apartado




class ApartadoSerializer(serializers.ModelSerializer):
    productos = ProductoField(many=True, read_only=True)
    detalles_apartado = detallesApartadoSerializer(many=True, read_only=True)  # Incluye los detalles del apartado
    cliente = serializers.StringRelatedField()

    class Meta:
        model = Apartado
        fields = '__all__'

class ApartadoSerializerEntrada(serializers.ModelSerializer):
    class Meta:
        model = Apartado
        fields = 'cliente','fecha_apartado', 'status', 'fecha_limite' 