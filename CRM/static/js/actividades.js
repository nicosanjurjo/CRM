
$(document).ready(function () {
    // Inicializar DataTables
    $('#actividades').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        columnDefs: [
            { orderable: false, targets: -1 }, // Desactiva el orden en la última columna (botón de acción)
            { orderable: false, targets: 7 }, // Desactiva el orden en la columna de Teléfono/WP
        ],
        initComplete: function () {
            // Añadir inputs de búsqueda a las columnas específicas (2 y 3)
            const targetColumns = [1, 2]; // Índices de las columnas que tendrán buscadores (Nombre Cli. e ID Cli.)
            this.api()
                .columns(targetColumns)
                .every(function () {
                    const column = this;
                    const header = $(column.header());
                    const input = $('<input type="text" placeholder="Buscar" class="form-control form-control-sm" />')
                        .appendTo(header)
                        .on('keyup change clear', function () {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
    
                    // Evitar que el clic en el input active el ordenamiento de la columna
                    input.on('click', function (e) {
                        e.stopPropagation();
                    });
                });
        }
    });
    

    $('#actividades tbody').on('click', '.seleccionar-actividad', function() {
        // Restablecer todos los botones y las filas a su color original
    $('#actividades tbody tr').each(function () {
        $(this).find('td').css('background-color', ''); // Eliminar color de fondo de todas las celdas
    });

    // Cambiar el color de fondo de cada celda (td) de la fila seleccionada
    const $fila = $(this).closest('tr');
    $fila.find('td').css('background-color', '#a9a9a9'); // Establecer color de fondo gris claro en todos los td

    // El resto del código permanece igual
    const $boton = $(this);
    $('.seleccionar-actividad').text('Seleccionar').prop('disabled', false).removeClass('btn-success').addClass('btn-primary');
    $boton.text('Seleccionada').prop('disabled', true).addClass('btn-success').removeClass('btn-primary');
    
        
        // Obtener los datos del cliente desde el atributo 'data' de la fila correspondiente
        const actividad = $(this).closest('tr').data();
        // Llenar los campos del formulario con los datos del cliente
    
        $('#cliente').val(actividad.clientenombre);
        $('#clienteId').val(actividad.clienteid);
        $('#email').val(actividad.email);
        $('#actividad-previa').val(actividad.actividadPrevia);
        $('#estado').val(actividad.estado);
        $('#prioridad').val(actividad.prioridad);
        $('#actividad').val(actividad.actividad);
        $('#observaciones').val(actividad.observaciones);
        $('#hora').val(actividad.hora);
        $('#actividadId').val(actividad.id);
        
        // Convertir la fecha al formato ISO (YYYY-MM-DD) si es necesario
        // Suponiendo que la fecha que tienes es algo como "20 de noviembre de 2024"
        const fecha = actividad.fecha; 
        const fechaConvertida = convertirFecha(fecha); // Llamamos a la función para convertirla

        // Asignar la fecha convertida al campo de fecha
        $('#fecha').val(fechaConvertida);
        
        // Ocultar los botones al cargar los datos
        $('#guardar-cambios').addClass('d-none');
        $('#completar-actividad').removeClass('d-none');
        $('#completar-programar').removeClass('d-none');
        $('#suspender-actividad').removeClass('d-none');
    });

    function convertirFecha(fecha) {
        const meses = {
            'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
            'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
            'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
        };

        // Extraer el día, mes y año de la fecha
        const partes = fecha.split(' de ');
        const dia = partes[0].padStart(2, '0'); // Asegurarnos que el día tenga dos dígitos
        const mes = meses[partes[1].toLowerCase()]; // Obtener el número del mes
        const año = partes[2];

        // Formatear la fecha a ISO (YYYY-MM-DD)
        return `${año}-${mes}-${dia}`;
    }

    $('#actividad-form input, #actividad-form select').on('input change', function() {
        // Mostrar los botones "Guardar cambios" y "Descartar modificaciones"
        $('#guardar-cambios').removeClass('d-none');
        $('#descartar-cambios').removeClass('d-none');
        $('#completar-actividad').addClass('d-none');
        $('#completar-programar').addClass('d-none');
        $('#suspender-actividad').addClass('d-none');
    });

    $('#descartar-cambios').on('click', function() {
        location.reload();
    })

    $('#cancelar-programar').on('click', function() {
        location.reload();
    })

    $('#guardar-cambios').on('click', function() {
        let actividadId = $('#actividadId').val();
        const prioridad = $('#prioridad').val();
        const actividad = $('#actividad').val();
        const observaciones = $('#observaciones').val();
        const fecha = $('#fecha').val();
        const hora = $('#hora').val();
    
        console.log('actividadId:', actividadId);  // Verificar el valor de actividadId
    
        // Realizamos la solicitud AJAX
        $.ajax({
            type: 'POST',
            url: '/actualizar-actividad/',  // URL de la vista
            data: {
                'actividad-id': actividadId,
                'prioridad': prioridad,
                'actividad': actividad,
                'observaciones': observaciones,
                'fecha': fecha,
                'hora': hora,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    location.reload();
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Error al intentar guardar los cambios');
            }
        });
    });
    
    // Función para completar una actividad
    function completarActividad(actividadId, callback = null) {
        if (!actividadId) {
            alert('No se ha seleccionado una actividad');
            return;
        }

        // Confirmar acción
        if (!confirm('¿Estás seguro de que quieres marcar esta actividad como completada?')) {
            return;
        }

        // Realizar la solicitud AJAX
        $.ajax({
            type: 'POST',
            url: `/actividades/completar/${actividadId}/`, // URL de la vista
            data: {
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    // Si se proporciona un callback, lo ejecutamos
                    if (callback) callback();
                    else location.reload(); // Por defecto recargar la página
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error al intentar completar la actividad');
            }
        });
    }

    // Manejar el clic en el botón "Completar actividad"
    $('#completar-actividad').on('click', function () {
        const actividadId = $('#actividadId').val();
        completarActividad(actividadId);
    });

    // Manejar el clic en el botón "Completar y programar otra"
    $('#completar-programar').on('click', function () {
        const actividadId = $('#actividadId').val();
        completarActividad(actividadId, function () {
            // Abrir el modal para programar otra actividad
            $('#programarModal').modal('show');
            $('#clienteId').val($('#clienteId').val());
            // Rellenar los campos del modal con la información actual
            $('#cliente-programar').val($('#cliente').val());
            $('#actividad-completada').val($('#actividad').val());
        });
    });

    $('input[name="tipoActividad"]').on('change', function () {
        const seleccion = $(this).val(); // Obtener el valor del radio seleccionado
        
        if (seleccion === "Otro") {
          $('#proxima-actividad').prop('disabled', false).val(''); // Habilitar y limpiar el input
        } else {
          $('#proxima-actividad').prop('disabled', true).val(seleccion); // Deshabilitar y asignar valor
        }
      });
  
    // Activar el estado inicial basado en el radio seleccionado por defecto
    $('input[name="tipoActividad"]:checked').trigger('change');

    $('#guardar-programar').on('click', function () {
        const cliente_id = $('#clienteId').val();
        const actividadCompletada = $('#actividad-completada').val();
        const proximaActividad = $('#proxima-actividad').val();
        const fecha = $('#fecha-programar').val();
        const hora = $('#hora-programar').val();

        if (!proximaActividad || !fecha ) {
            alert('Todos los campos son obligatorios');
            return;
        }

        // Realizar la solicitud AJAX para programar la nueva actividad
        $.ajax({
            type: 'POST',
            url: '/actividades/programar/', // URL de la vista para programar nueva actividad
            data: {
                'cliente': cliente_id,
                'actividad_completada': actividadCompletada,
                'proxima_actividad': proximaActividad,
                'fecha': fecha,
                'hora': hora,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function (response) {
                if (response.success) {
                    alert('Nueva actividad programada correctamente');
                    location.reload();
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error al intentar programar la nueva actividad');
            }
        });
    });

    $('#suspender-actividad').on('click', function () {
        const actividadId = $('#actividadId').val(); // Obtener el ID de la actividad seleccionada
    
        if (!actividadId) {
            alert('No se ha seleccionado una actividad');
            return;
        }
    
        // Confirmar acción
        if (!confirm('¿Estás seguro de que quieres suspender esta actividad?')) {
            return;
        }
    
        // Realizar la solicitud AJAX
        $.ajax({
            type: 'POST',
            url: `/actividades/suspender/${actividadId}/`, // URL de la vista
            data: {
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function (response) {
                if (response.success) {
                    alert(response.message);
                    location.reload();
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert('Error al intentar suspender la actividad');
            }
        });
    });

    $('#ver-completadas').on('click', function () {
        $('#completadasModal').modal('show');
    });
});
