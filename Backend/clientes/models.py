from django.db import models




class Direccion(models.Model):
    direccion = models.CharField(max_length=255 )
    colonia =models.CharField(max_length=100)
    ciudad = models.CharField(max_length=100)
    estado = models.CharField(max_length=100 )
    pais = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.direccion}, {self.ciudad}, {self.pais}, {self.codigo_postal}'
class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    correo =models.EmailField(null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion=models.ForeignKey(Direccion, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.nombre