from django.shortcuts import render, redirect, get_object_or_404
from django.utils.dateparse import parse_date, parse_time
from .models import Cliente, Actividad, Contrato
from django.utils.timezone import localdate, now, localtime
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
import datetime


def index(request):
    return render(request, 'main/index.html')

def clientes(request):
    clientes = Cliente.objects.all()

    return render(request, 'main/clientes.html', {'clientes': clientes})

def clientes_json(request):
    clientes = Cliente.objects.filter(activo=True).values(
        'id', 'numero_cliente', 'nombre', 'direccion', 'ciudad', 'estado',
        'cp', 'email', 'telefono_casa', 'telefono_trabajo', 'telefono_movil',
        'distribuidor', 'vendedor', 'nivel', 'ultima_compra', 'ultimo_pago',
        'pedidos', 'tipo', 'ultima_actividad', 'proxima_actividad'
    )
    return JsonResponse(list(clientes), safe=False)


def crear_cliente(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        # Validar campos obligatorios
        nombre = data.get("nombre")
        telefono_movil = data.get("telefono_movil")

        if not nombre or not telefono_movil:
            return JsonResponse({"error": "Faltan campos obligatorios (nombre y teléfono móvil)"}, status=400)

        # Verificar existencia de cliente
        if Cliente.objects.filter(telefono_movil=telefono_movil).exists():
            return JsonResponse({"error": "Ya existe un cliente con este teléfono móvil"}, status=400)

        # Crear el cliente, asignando "No disponible" si algún campo no está presente
        cliente = Cliente(
            numero_cliente=data.get("numero_cliente", 0),
            nombre=nombre,
            direccion=data.get("direccion", "No disponible"),
            ciudad=data.get("ciudad", "No disponible"),
            estado=data.get("estado", "No disponible"),
            cp=data.get("cp", "No disponible"),
            email=data.get("email", "No disponible"),
            telefono_casa=data.get("telefono_casa", "No disponible"),
            telefono_trabajo=data.get("telefono_trabajo", "No disponible"),
            telefono_movil=telefono_movil,
            distribuidor=data.get("distribuidor", "No disponible"),
            vendedor=data.get("vendedor", "No disponible"),
            nivel=data.get("nivel"),
            ultima_compra=data.get("ultima_compra", None),  # Puede ser null si no se proporciona
            ultimo_pago=data.get("ultimo_pago", None),  # Puede ser null si no se proporciona
            pedidos=data.get("pedidos", "No disponible"),
            tipo=data.get("tipo", "No disponible"),
            activo=data.get("activo", True),
        )
        cliente.save()
        
        return JsonResponse({"message": "Cliente creado exitosamente"})

    return JsonResponse({"error": "Método no permitido"}, status=405)


@csrf_exempt
def actualizar_cliente(request, cliente_id):
    if request.method == "POST":
        try:
            # Recuperar datos JSON del cuerpo de la solicitud
            data = json.loads(request.body)
            
            # Buscar el cliente en la base de datos
            cliente = Cliente.objects.get(id=cliente_id)
            
            # Actualizar los campos del cliente
            cliente.numero_cliente = data.get('numero_cliente', cliente.numero_cliente)
            cliente.nombre = data.get('nombre', cliente.nombre)
            cliente.direccion = data.get('direccion', cliente.direccion)
            cliente.ciudad = data.get('ciudad', cliente.ciudad)
            cliente.estado = data.get('estado', cliente.estado)
            cliente.cp = data.get('cp', cliente.cp)
            cliente.email = data.get('email', cliente.email)
            cliente.telefono_casa = data.get('telefono_casa', cliente.telefono_casa)
            cliente.telefono_trabajo = data.get('telefono_trabajo', cliente.telefono_trabajo)
            cliente.telefono_movil = data.get('telefono_movil', cliente.telefono_movil)
            cliente.distribuidor = data.get('distribuidor', cliente.distribuidor)
            cliente.vendedor = data.get('vendedor', cliente.vendedor)
            cliente.nivel = data.get('nivel', cliente.nivel)
            cliente.ultima_compra = data.get('ultima_compra', cliente.ultima_compra)
            cliente.ultimo_pago = data.get('ultimo_pago', cliente.ultimo_pago)
            cliente.pedidos = data.get('pedidos', cliente.pedidos)
            cliente.tipo = data.get('tipo', cliente.tipo)
            
            # Guardar los cambios en la base de datos
            cliente.save()

            return JsonResponse({'message': 'Cliente actualizado correctamente.'}, status=200)

        except Cliente.DoesNotExist:
            return JsonResponse({'error': 'Cliente no encontrado.'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Datos JSON inválidos.'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

def desactivar_cliente(request, cliente_id):
    if request.method == "PUT":
        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return JsonResponse({"error": "Cliente no encontrado"}, status=404)

        cliente.activo = False  # Cambia el estado a inactivo
        cliente.save()

        return JsonResponse({"message": f"Cliente {cliente.nombre} desactivado exitosamente"})
    
    return JsonResponse({"error": "Método no permitido"}, status=405)

def activar_cliente(request, cliente_id):
    if request.method == 'PUT':
        try:
            cliente = Cliente.objects.get(id=cliente_id)
            cliente.activo = True
            cliente.save()
            return JsonResponse({'message': 'Cliente reactivado con éxito.'})
        except Cliente.DoesNotExist:
            return JsonResponse({'error': 'Cliente no encontrado.'}, status=404)
    return JsonResponse({'error': 'Método no permitido.'}, status=405)


def crear_actividad(request):
    if request.method == "POST":
        try:
            # Cargar datos del cuerpo de la solicitud
            data = json.loads(request.body)
            
            # Validar que el cliente existe
            cliente_id = data.get("cliente")
            cliente = Cliente.objects.filter(id=cliente_id).first()
            
            if not cliente:
                return JsonResponse({"error": "Cliente no encontrado"}, status=404)

            # Extraer los datos del formulario
            actividad_realizada = data.get("actividad_realizada", "")
            actividad_proxima = data.get("actividad_proxima", "")
            observaciones = data.get("observaciones", "")
            prioridad = data.get("prioridad", "Media")
            fecha_str = data.get("fecha")
            hora_str = data.get("hora")

            # Validar y parsear la fecha
            fecha = parse_date(fecha_str) if fecha_str else None

            # Si la fecha es inválida, devolver un error
            if not fecha:
                return JsonResponse({"error": "Fecha inválida"}, status=400)

            fecha_actual = localtime(now()).date()
            print(fecha)
            print(fecha_actual)
            if fecha >= fecha_actual:
                            # Crear la nueva actividad
                actividad = Actividad(
                    cliente=cliente,
                    actividad_anterior=actividad_realizada,
                    actividad_programada=actividad_proxima,
                    observaciones=observaciones,
                    fecha=fecha,
                    hora=hora_str,  # Guardar la hora como texto
                    prioridad=prioridad,
                    estado='Pendiente'  # Establecer el estado como 'pendiente'
                )
                actividad.save()
                cliente.proxima_actividad=actividad_proxima
                cliente.save()
                # Retornar respuesta de éxito
                return JsonResponse({"message": "Actividad creada con éxito"}, status=201)
            else:
                return JsonResponse({
                'success': False,
                'message': 'La fecha programada debe ser posterior a la fecha actual.'
                })

        except (KeyError, ValueError) as e:
            return JsonResponse({"error": f"Datos inválidos: {str(e)}"}, status=400)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)
    

def actividades_hoy(request):
    # Obtener la fecha actual
    fecha_hoy = localdate()

    # Filtrar actividades con fecha de hoy
    actividades = Actividad.objects.filter(fecha=fecha_hoy)

    # Renderizar la plantilla con las actividades filtradas
    return render(request, 'main/actividades_hoy.html', {'actividades': actividades})

@csrf_exempt
def actualizar_actividad(request):
    if request.method == 'POST':
        actividad_id = request.POST.get('actividad-id')
        actividad = get_object_or_404(Actividad, id=actividad_id)
        
        # Recibir los campos modificados
        prioridad = request.POST.get('prioridad')
        actividad_proxima = request.POST.get('actividad')
        fecha_programada = request.POST.get('fecha')
        hora_programada = request.POST.get('hora')
        observaciones = request.POST.get('observaciones')

        try:
            fecha_programada = datetime.datetime.strptime(fecha_programada, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({
                'success': False,
                'message': 'Formato de fecha inválido. Use el formato YYYY-MM-DD.'
            })

        # Validar que la fecha programada sea posterior al día actual
        fecha_actual = localtime(now()).date()
        hora_actual = localtime(now()).time()
        if fecha_programada < fecha_actual:
            return JsonResponse({
                'success': False,
                'message': 'La fecha programada debe ser posterior a la fecha actual.'
            })

        # Actualizar los campos de la actividad
        actividad.prioridad = prioridad
        actividad.actividad_programada = actividad_proxima
        actividad.observaciones = observaciones
        actividad.fecha = fecha_programada
        actividad.hora = hora_programada

        # Guardar los cambios
        actividad.save()

        return JsonResponse({'success': True, 'message': 'Actividad actualizada correctamente'})

    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)

def completar_actividad(request, id):
    if request.method == 'POST':
        actividad = get_object_or_404(Actividad, id=id)
        cliente = actividad.cliente

        if actividad.estado == 'Completada':
            return JsonResponse({'success': False, 'message': 'Esta actividad ya está marcada como completada.'})

        # Cambiar el estado de la actividad
        actividad.estado = 'Completada'
        actividad.save()
        cliente.ultima_actividad = actividad.actividad_programada
        cliente.proxima_actividad = "No disponible"
        cliente.save()
        return JsonResponse({'success': True, 'message': 'La actividad se ha marcado como completada.'})

    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)

def programar_actividad(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente')
        actividad_completada = request.POST.get('actividad_completada')
        proxima_actividad = request.POST.get('proxima_actividad')
        fecha = request.POST.get('fecha')
        hora = request.POST.get('hora')

        # Validar campos
        if not cliente_id or not proxima_actividad or not fecha:
            return JsonResponse({'success': False, 'message': 'Todos los campos son obligatorios'})

        # Obtener el cliente
        cliente = get_object_or_404(Cliente, id=cliente_id)
        fecha_actual = localtime(now()).date()
        try:
            fecha= datetime.datetime.strptime(fecha, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({
                'success': False,
                'message': 'Formato de fecha inválido. Use el formato YYYY-MM-DD.'
            })
        # Crear la nueva actividad
        if fecha >= fecha_actual:
            nueva_actividad = Actividad.objects.create(
                cliente=cliente,
                actividad_anterior=actividad_completada,
                actividad_programada=proxima_actividad,
                fecha=fecha,
                hora=hora,
                estado='Pendiente'
            )
            nueva_actividad.save()
            return JsonResponse({'success': True, 'message': 'Nueva actividad programada con éxito'})

    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)


def suspender_actividad(request, id):
    if request.method == 'POST':
        actividad = get_object_or_404(Actividad, id=id)

        if actividad.estado == 'Suspendida':
            return JsonResponse({'success': False, 'message': 'Esta actividad ya está marcada como suspendida.'})

        # Cambiar el estado de la actividad
        actividad.estado = 'Suspendida'
        actividad.save()

        return JsonResponse({'success': True, 'message': 'La actividad se ha marcado como suspendida.'})

    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)

def actividades_pasadas(request):
    fecha_actual = localtime(now()).date()
    actividades = Actividad.objects.filter(fecha__lt=fecha_actual).order_by('-fecha')
    return render(request, 'main/actividades_pasadas.html', {'actividades': actividades})

def actividades_futuras(request):
    fecha_actual = localtime(now()).date()
    actividades = Actividad.objects.filter(fecha__gt=fecha_actual).order_by('-fecha')
    return render(request, 'main/actividades_futuras.html', {'actividades': actividades})

def contratos(request):
    contratos = Contrato.objects.all()
    clientes = Cliente.objects.all()
    return render(request, 'main/contratos.html', {'contratos': contratos, 'clientes': clientes})

def asignar_contrato(request, cliente_id):
    cliente = get_object_or_404(Cliente, id=cliente_id)
    return render(request, 'main/crear_contrato.html', {'cliente': cliente})

def crear_contrato(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente')
        productos = request.POST.get('productos')
        modalidad = request.POST.get('modalidad')

        # Validar datos obligatorios
        if not cliente_id or not productos or not modalidad:
            return JsonResponse({'message': 'Todos los campos son obligatorios.'}, status=400)

        try:
            cliente = Cliente.objects.get(id=cliente_id)
        except Cliente.DoesNotExist:
            return JsonResponse({'message': 'Cliente no encontrado.'}, status=404)

        # Crear el contrato
        contrato = Contrato.objects.create(
            cliente=cliente,
            productos=productos,
            modalidad=modalidad,
        )
        return JsonResponse({'message': 'Contrato creado exitosamente.', 'id': contrato.id}, status=201)
    
    return JsonResponse({'message': 'Método no permitido.'}, status=405)

@csrf_exempt
def editar_contrato(request):
    if request.method == 'POST':
        try:
            contrato_id = request.POST.get('contrato_id')
            nuevo_estado = request.POST.get('estado')
            
            # Obtener el contrato por su ID
            contrato = Contrato.objects.get(id=contrato_id)
            
            # Actualizar el estado del contrato
            contrato.estado = nuevo_estado
            contrato.save()

            # Respuesta exitosa
            return JsonResponse({'message': 'Estado del contrato actualizado correctamente.'})

        except Contrato.DoesNotExist:
            return JsonResponse({'message': 'Contrato no encontrado.'}, status=404)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
    
    return JsonResponse({'message': 'Método no permitido.'}, status=405)


def reportes(request):
    return render(request, 'main/reportes.html')


