from django.db import models


# Create your models here.
class Cliente(models.Model):
    numero_cliente = models.SmallIntegerField()
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=140, default="No disponible", blank=True, null=True)
    ciudad = models.CharField(max_length=140, default="No disponible", blank=True, null=True)
    estado = models.CharField(max_length=140, default="No disponible", blank=True, null=True)
    cp = models.CharField(max_length=10, default="No disponible", blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefono_casa = models.CharField(max_length=20, default="No disponible", blank=True, null=True)
    telefono_trabajo = models.CharField(max_length=20, default="No disponible", blank=True, null=True)
    telefono_movil = models.CharField(max_length=20, default="No disponible", blank=True, null=True)
    distribuidor = models.CharField(max_length=25, default="No disponible", blank=True, null=True)
    vendedor = models.CharField(max_length=25, default="No disponible", blank=True, null=True)
    nivel = models.SmallIntegerField(blank=True, null=True)
    ultima_compra = models.CharField(max_length=140, default="No disponible")
    ultimo_pago = models.CharField(max_length=140, default="No disponible")
    pedidos = models.TextField(default="No disponible", blank=True, null=True)
    tipo = models.CharField(max_length=140, default="No disponible", blank=True, null=True)
    activo = models.BooleanField(default=True)  # True para activo, False para inactivo
    ultima_actividad = models.CharField(max_length=140, default="No disponible")
    proxima_actividad = models.CharField(max_length=140, default="No disponible")

    def __str__(self):
        return self.nombre


class Actividad(models.Model):
    ESTADO_OPCIONES = [
        ('Pendiente', 'Pendiente'),
        ('Completada', 'Completada'),
        ('Suspendida', 'Suspendida')
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="actividades")
    actividad_anterior = models.CharField(max_length=140, default='No disponible')
    actividad_programada = models.CharField(max_length=140)
    observaciones = models.CharField(max_length=140, default='No disponible')
    fecha = models.DateField()
    hora = models.CharField(max_length=5, null=True, blank=True)
    prioridad = models.CharField(max_length=25, default='Media')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(blank=True, null=True, auto_now=True)
    estado = models.CharField(max_length=15, choices=ESTADO_OPCIONES, default='Pendiente')
    #observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.actividad_programada} ({self.get_estado_display()})"
    

class Contrato(models.Model):
    ESTADO_OPCIONES = [
        ('Iniciado', 'Iniciado'),
        ('Terminado', 'Terminado'),
        ('Suspendido', 'Suspendido')
    ]

    MODALIDAD_OPCIONES = [
        ('Financiado', 'Financiado'),
        ('Contado', 'Contado')
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name="contratos")
    productos = models.CharField(max_length=250)
    modalidad = models.CharField(max_length=15)
    estado = models.CharField(max_length=15, choices=ESTADO_OPCIONES, default='Iniciado')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(blank=True, null=True, auto_now=True)

    def __str__(self):
        return f"Contrato N{self.id} {self.cliente}"
    