from django.db import models

# Create your models here.
class Apartado(models.Model):
    fecha_apartado=models.DateField()
    status=models.IntegerField()
    fecha_limite=models.DateField()
    total=models.DecimalField(max_digits=10, decimal_places=2)
    productos=models.ManyToManyField('productos.Producto', through='detallesApartado') 

    def __str__(self):
        return str(self.fecha_apartado)
class detallesApartado(models.Model):
    apartado=models.ForeignKey(Apartado, on_delete=models.CASCADE)
    producto=models.ForeignKey('productos.Producto', on_delete=models.CASCADE)
    cantidad=models.IntegerField()
    subtotal=models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return str(self.apartado)