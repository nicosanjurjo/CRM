$(document).ready(function () {
    $('#editButtons').addClass('hidden');
    $('#createClient').removeClass('hidden');
});

$(document).ready(function() {

    $('#clientesTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        columnDefs: [
            { orderable: false, targets: -1 },
            { orderable: false, targets: 1 },
            { orderable: false, targets: 5 },
            { orderable: false, targets: 6 },
        ],
        initComplete: function () {
            const excludeColumns = [10, 9, 8, 7, 6, 5];
            this.api()
                .columns()
                .every(function () {
                    const column = this;
                    const header = $(column.header());
                    if (!excludeColumns.includes(column.index())) {
                        const input = $('<input type="text" placeholder="Buscar" class="form-control form-control-sm" />')
                            .appendTo(header)
                            .on('keyup change clear', function () {
                                if (column.search() !== this.value) {
                                    column.search(this.value).draw();
                                }
                            });
                        
                        // Evitar que el clic en el input active el ordenamiento
                        input.on('click', function (e) {
                            e.stopPropagation();
                        });
                    }
                });
        }
    });

    function actualizarTabla() {
        $.ajax({
            url: '/clientes_json/', // Ruta que devuelve los clientes en formato JSON
            type: 'GET',
            success: function (data) {
                const dataTable = $('#clientesTable').DataTable(); // Accede a la instancia de DataTables
    
                // Limpia las filas existentes en la tabla sin destruir la instancia
                dataTable.clear();
    
                // Añade las nuevas filas con los datos obtenidos
                data.forEach(cliente => {
                    const row = $(`
                        <tr class="cliente-row" 
                            data-id="${cliente.id}" 
                            data-numcliente="${cliente.numero_cliente}"
                            data-nombre="${cliente.nombre}"
                            data-direccion="${cliente.direccion}"
                            data-ciudad="${cliente.ciudad}"
                            data-estado="${cliente.estado}"
                            data-cp="${cliente.cp}"
                            data-email="${cliente.email}"
                            data-telcasa="${cliente.telefono_casa}"
                            data-teltrabajo="${cliente.telefono_trabajo}"
                            data-telmovil="${cliente.telefono_movil}"
                            data-distribuidor="${cliente.distribuidor}"
                            data-vendedor="${cliente.vendedor}"
                            data-nivel="${cliente.nivel}"
                            data-ultimacompra="${cliente.ultima_compra}"
                            data-ultimopago="${cliente.ultimo_pago}"
                            data-pedidos="${cliente.pedidos}"
                            data-tipo="${cliente.tipo}"
                            data-ultima-actividad="${cliente.ultima_actividad}">
                            <td>${cliente.id}</td>
                            <td>${cliente.numero_cliente}</td>
                            <td>${cliente.nombre}</td>
                            <td>${cliente.ciudad}</td>
                            <td>${cliente.estado}</td>
                            <td>${cliente.email}</td>
                            <td>${cliente.telefono_movil}</td>
                            <td>${cliente.nivel}</td>
                            <td>${cliente.ultima_actividad || "No disponible"}</td>
                            <td>${cliente.proxima_actividad || "No disponible"}</td>
                            <td>
                                <button type="button" class="btn btn-primary seleccionar-cliente">Seleccionar</button>
                            </td>
                        </tr>
                    `);
    
                    dataTable.row.add(row); // Agrega el nuevo `<tr>` al DataTable
                });
    
                // Redibuja la tabla manteniendo el estado de la paginación
                dataTable.draw(false);
            },
            error: function () {
                alert('Error al actualizar la tabla de clientes.');
            }
        });
    }
    
    

    // Función para llenar el nombre del cliente en ambos formularios
    function setClienteName(nombre, clienteId) { 
        // Formulario de actividad
        $('#activityForm').data('cliente-id', clienteId); // Almacenar el ID en el formulario de actividad
    }

    // Limpiar formulario al hacer clic en "Nuevo Cliente"
    $('#newClientButton').on('click', function() {
        $('#clientesTable tbody tr').each(function () {
            $(this).find('td').css('background-color', ''); // Eliminar color de fondo de todas las celdas
            $('.seleccionar-cliente').text('Seleccionar').prop('disabled', false).removeClass('btn-success').addClass('btn-primary');
        });
        $('#clienteForm')[0].reset();
        $('#activityForm')[0].reset();
        $('#formTitle').text('Ingrese los datos');
        $('#editButtons').addClass('hidden');
        $('#createClient').removeClass('hidden');
        $('#clienteId').val('');
    });

    $('input[name="tipoActividad"]').on('change', function () {
        const seleccion = $(this).val(); // Obtener el valor del radio seleccionado
        
        if (seleccion === "Otro") {
          $('#proximaActividad').prop('disabled', false).val(''); // Habilitar y limpiar el input
        } else {
          $('#proximaActividad').prop('disabled', true).val(seleccion); // Deshabilitar y asignar valor
        }
      });
  
      // Activar el estado inicial basado en el radio seleccionado por defecto
      $('input[name="tipoActividad"]:checked').trigger('change');

    // Rellenar el formulario al hacer clic en el botón de selección de cliente
    $('#clientesTable tbody').on('click', '.seleccionar-cliente', function() {
        $('#clientesTable tbody tr').each(function () {
            $(this).find('td').css('background-color', ''); // Eliminar color de fondo de todas las celdas
        });
        const $fila = $(this).closest('tr');
        $fila.find('td').css('background-color', '#a9a9a9');

        const $boton = $(this);
        $('.seleccionar-cliente').text('Seleccionar').prop('disabled', false).removeClass('btn-success').addClass('btn-primary');
        $boton.text('Seleccionado').prop('disabled', true).addClass('btn-success').removeClass('btn-primary');
    
        // Obtener los datos del cliente desde el atributo 'data' de la fila correspondiente
        const cliente = $(this).closest('tr').data();

        // Llenar los campos del formulario con los datos del cliente
        setClienteName(cliente.nombre, cliente.id);

        $('#numcliente').val(cliente.numcliente);
        $('#nombre').val(cliente.nombre);
        $('#direccion').val(cliente.direccion);
        $('#ciudad').val(cliente.ciudad);
        $('#estado').val(cliente.estado);
        $('#CP').val(cliente.cp);
        $('#email').val(cliente.email);
        $('#telmovil').val(cliente.telmovil);
        $('#telcasa').val(cliente.telcasa);
        $('#teltrabajo').val(cliente.teltrabajo);
        $('#distribuidor').val(cliente.distribuidor);
        $('#vendedor').val(cliente.vendedor);
        $('#nivel').val(cliente.nivel);
        $('#ultimacompra').val(cliente.ultimacompra);
        $('#ultimopago').val(cliente.ultimopago);
        $('#tipo').val(cliente.tipo);  // Si no se muestra en la tabla, pero está en los atributos
        $('#pedidos').val(cliente.pedidos);  // Si no se muestra en la tabla, pero está en los atributos

        $('#clienteId').val(cliente.id);

        $('#formTitle').text('Datos del cliente');
        $('#editButtons').removeClass('hidden');
        $('#createClient').addClass('hidden');
        $('#actividadRealizada').val(cliente.ultimaActividad || '');
    });

    // Crear un nuevo cliente
    $('#createClient').on('click', function(event) {
        event.preventDefault();
    
        const formData = {
            numero_cliente: $('#numcliente').val() || 0,
            nombre: $('#nombre').val(),
            direccion: $('#direccion').val() || "No disponible",
            ciudad: $('#ciudad').val() || "No disponible",
            estado: $('#estado').val() || "No disponible",
            cp: $('#CP').val() || "No disponible",
            email: $('#email').val() || "No disponible",
            telefono_casa: $('#telcasa').val() || "No disponible",
            telefono_trabajo: $('#teltrabajo').val() || "No disponible",
            telefono_movil: $('#telmovil').val(),
            distribuidor: $('#distribuidor').val() || "No disponible",
            vendedor: $('#vendedor').val() || "No disponible",
            nivel: $('#nivel').val() || 0,
            ultima_compra: $('#ultimacompra').val(),
            ultimo_pago: $('#ultimopago').val(),
            pedidos: $('#pedidos').val() || "No disponible",
            tipo: $('#tipo').val() || "No disponible",
        };
    
        $.ajax({
            url: '/crear_cliente/',
            type: 'POST',
            headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);
                location.reload(); // Recargar para reflejar los cambios
            },
            error: function(xhr) {
                alert('Error: ' + xhr.responseJSON.error);
            },
        });
    });

    $('#updateClient').on('click', function(event) {
        event.preventDefault();
    
        const clienteId = $('#clienteId').val(); // ID del cliente
        const formData = {
            numero_cliente: $('#numcliente').val(),
            nombre: $('#nombre').val(),
            direccion: $('#direccion').val(),
            ciudad: $('#ciudad').val(),
            estado: $('#estado').val(),
            cp: $('#CP').val(),
            email: $('#email').val(),
            telefono_casa: $('#telcasa').val(),
            telefono_trabajo: $('#teltrabajo').val(),
            telefono_movil: $('#telmovil').val(),
            distribuidor: $('#distribuidor').val(),
            vendedor: $('#vendedor').val(),
            nivel: $('#nivel').val(),
            ultima_compra: $('#ultimacompra').val(),
            ultimo_pago: $('#ultimopago').val(),
            pedidos: $('#pedidos').val(),
            tipo: $('#tipo').val(),
        };
    
        $.ajax({
            url: `/actualizar_cliente/${clienteId}/`, // URL de la vista de actualización
            type: 'POST',
            headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                alert(response.message); // Mensaje de éxito
                location.reload(); // Recargar para reflejar los cambios
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON?.error || 'Ha ocurrido un error';
                alert('Error: ' + errorMessage);
            },
        });
    });

    $('#disableClient').on('click', function(event) {
        event.preventDefault();
    
        const clienteId = $('#clienteId').val();
    
        if (!clienteId) {
            alert('Por favor, selecciona un cliente para desactivarlo.');
            return;
        }
    
        if (!confirm('¿Estás seguro de que deseas dejar inactivo a este cliente?')) {
            return; // Confirmación cancelada
        }
    
        $.ajax({
            url: `/desactivar_cliente/${clienteId}/`,
            type: 'PUT',
            headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
            success: function(response) {
                alert(response.message);
                location.reload(); // Recarga la página para reflejar los cambios
            },
            error: function(xhr) {
                alert('Error: ' + xhr.responseJSON.error);
            },
        });
    });

    // Mostrar el modal de clientes inactivos
    $('#showInactiveClients').on('click', function () {
        $('#inactiveClientsModal').modal('show');
    });

    // Reactivar un cliente
    $('#inactiveClientsTable').on('click', '.reactivar-cliente', function () {
        const clienteId = $(this).data('id');

        if (!clienteId) {
            alert('Error: No se pudo identificar al cliente.');
            return;
        }

        if (!confirm('¿Estás seguro de que deseas reactivar este cliente?')) {
            return; // Confirmación cancelada
        }

        $.ajax({
            url: `/activar_cliente/${clienteId}/`, // Ruta del backend para reactivar clientes
            type: 'PUT',
            headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
            success: function (response) {
                alert(response.message);
                location.reload();
            },
            error: function (xhr) {
                alert('Error al reactivar el cliente: ' + xhr.responseJSON.error);
            },
        });
    });

    // Manejar el envío del formulario de actividad
    $('#activityForm').on('submit', function (event) {
        event.preventDefault();

        const clienteId = $(this).data('cliente-id');
        if (!clienteId && clienteId !== 0) {
            alert('Por favor, selecciona un cliente antes de registrar una actividad.');
            return;
        }

        const formData = {
            cliente: clienteId,
            actividad_realizada: $('#actividadRealizada').val(),
            actividad_proxima: $('#proximaActividad').val(),
            observaciones: $('#observaciones').val(),
            fecha: $('#fechaProgramada').val(),
            hora: $('#horaProgramada').val(),
            prioridad: $('#prioridad').val(),
        };
        console.log(clienteId);
        console.log(formData);
        $.ajax({
            url: '/crear_actividad/', // Asegúrate de tener esta vista en tu backend
            type: 'POST',
            headers: { 'X-CSRFToken': $('input[name=csrfmiddlewaretoken]').val() },
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                alert(response.message);
                $('#activityForm')[0].reset();
                $('input[name="tipoActividad"]:checked').trigger('change');
                $('#clienteForm')[0].reset();
                //$('td').css('background-color', ''); // Eliminar color de fondo de todas las celdas
                //$('.seleccionar-cliente').text('Seleccionar').prop('disabled', false).removeClass('btn-success').addClass('btn-primary');
                actualizarTabla();
            },
            error: function (xhr) {
                alert('Error al registrar la actividad: ' + (xhr.responseJSON?.message || 'Desconocido'));
            },
        });
    });

    // Inicializar comportamiento del botón "Asignar contrato"
    $('#asignarContrato').on('click', function() {
        // Obtener el ID del cliente seleccionado desde el formulario
        const clienteId = $('#clienteId').val();

        if (!clienteId) {
            alert('Por favor, selecciona un cliente antes de asignar un contrato.');
            return;
        }

        // Redirigir a la URL del formulario de asignación de contrato, pasando el ID del cliente
        window.location.href = `/contrato/${clienteId}/asignar/`;
    });
});