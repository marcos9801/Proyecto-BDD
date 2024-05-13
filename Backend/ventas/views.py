from django.shortcuts import render, get_object_or_404
from .models import Venta, Producto

def lista_ventas(request):
    ventas = Venta.objects.all()
    return render(request, 'ventas/lista_ventas.html', {'ventas': ventas})

def detalle_venta(request, id):
    venta = get_object_or_404(Venta, pk=id)
    return render(request, 'ventas/detalle_venta.html', {'venta': venta})

def lista_productos(request):
    productos = Producto.objects.all()
    return render(request, 'productos/lista_productos.html', {'productos': productos})

def detalle_producto(request, id):
    producto = get_object_or_404(Producto, pk=id)
    return render(request, 'productos/detalle_producto.html', {'producto': producto})
