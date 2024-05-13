from rest_framework import serializers
from .models import Categoria, Producto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer()

    class Meta:
        model = Producto
        fields = '__all__'
    def create(self, validated_data):
        categoria_data = validated_data.pop('categoria')
        categoria = Categoria.objects.create(**categoria_data)
        producto = Producto.objects.create(categoria=categoria, **validated_data)
        return producto

    def update(self, instance, validated_data):
        categoria_data = validated_data.pop('categoria')
        categoria = instance.categoria
        categoria.nombre = categoria_data.get('nombre', categoria.nombre)
        categoria.descripcion = categoria_data.get('descripcion', categoria.descripcion)
        categoria.save()

        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.imagen = validated_data.get('imagen', instance.imagen)  # Aquí asumiendo que 'imagen' es el nombre del campo de la imagen en tu modelo
        instance.save()

        return instance
