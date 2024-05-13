from django.db import models

# Create your models here.
class Categoria(models.Model):
    nombre=models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
    
class Producto(models.Model):
    categoria=models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    imagen=models.ImageField(upload_to='imagenes/', null=True, blank=True)
    cantidad =models.IntegerField()
    nombre= models.CharField(max_length=100)
    descripcion = models.TextField()
    precio =models.FloatField()
    material=models.CharField(max_length=50)

    def __str__(self):
        return self.nombre