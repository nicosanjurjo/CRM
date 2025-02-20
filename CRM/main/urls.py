from django.urls import path
from . import views

urlpatterns = [
   
    path('', views.index, name='index'),
    path('clientes/', views.clientes, name='clientes'),
    path('clientes_json/', views.clientes_json, name='clientes_json'),
    path('crear_cliente/', views.crear_cliente, name='CrearCliente'),
    path('actualizar_cliente/<int:cliente_id>/', views.actualizar_cliente, name='ActualizarCliente'),
    path('desactivar_cliente/<int:cliente_id>/', views.desactivar_cliente, name='desactivar_cliente'),
    path('activar_cliente/<int:cliente_id>/', views.activar_cliente, name='reactivar_cliente'),
    path('actividades/hoy/', views.actividades_hoy, name='actividadesHoy'),
    path('actualizar-actividad/', views.actualizar_actividad, name='actualizarActividad'),
    path('actividades/completar/<int:id>/', views.completar_actividad, name='completar_actividad'),
    path('actividades/programar/', views.programar_actividad, name='programar_actividad'),
    path('actividades/suspender/<int:id>/', views.suspender_actividad, name='suspender_actividad'),
    path('actividades/pasadas/', views.actividades_pasadas, name='actividadesPasadas'),
    path('actividades/futuras/', views.actividades_futuras, name='actividadesFuturas'),
    path('crear_actividad/', views.crear_actividad, name='crear_actividad'),
    path('contratos/', views.contratos, name='contratos'),
    path('contrato/<int:cliente_id>/asignar/', views.asignar_contrato, name='asignar_contrato'),
    path('contratos/crear/', views.crear_contrato, name='crear_contrato'),
    path('contratos/editar/', views.editar_contrato, name='editar_contrato'),
    path('reportes/', views.reportes, name='reportes'),
]
