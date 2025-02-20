$(document).ready(function() {
    // Inicializar DataTables
    $('#contratosTable').DataTable();


    $('#formContrato').on('submit', function (event) {
        event.preventDefault(); // Evitar recarga del formulario

        const cliente = $('#clienteid').val();
        const productos = $('#productos').val();
        const modalidad = $('#modalidad').val();
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        console.log(cliente);
        console.log(productos);
        console.log(modalidad);
        // Validar campos antes de enviar
        if (!cliente || !productos || !modalidad) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Enviar datos con AJAX
        $.ajax({
            type: 'POST',
            url: '/contratos/crear/', // URL para crear el contrato
            data: {
                cliente: cliente,
                productos: productos,
                modalidad: modalidad,
                csrfmiddlewaretoken: csrfToken
            },
            success: function (response) {
                // Mostrar mensaje de éxito y actualizar la página
                alert(response.message);
                window.location.href = "/contratos/"; // Redirigir a la URL de la lista de contratos
            },
            error: function (xhr) {
                // Manejar errores
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Error inesperado al crear el contrato.';
                alert(errorMessage);
            }
        });
    });

     // Cuando se hace clic en el botón Editar
     $('.editar-contrato').on('click', function() {
        const contratoId = $(this).data('id'); // Obtener ID del contrato
        const estadoActual = $(this).data('estado'); // Obtener estado actual del contrato

        // Rellenar el modal con los datos actuales
        $('#contrato-id').val(contratoId); // Asignar el ID del contrato al campo oculto
        $('#estado').val(estadoActual); // Asignar el estado actual al select

        // Mostrar el modal
        $('#editarContratoModal').modal('show');
    });

    // Manejo del envío del formulario del modal
    $('#editarContratoForm').on('submit', function(event) {
        event.preventDefault(); // Evitar recarga del formulario

        const contratoId = $('#contrato-id').val(); // Obtener ID del contrato
        const nuevoEstado = $('#estado').val(); // Obtener el nuevo estado seleccionado
        const csrfToken = $('input[name="csrfmiddlewaretoken"]').val(); // Obtener el token CSRF

        // Enviar los datos con AJAX
        $.ajax({
            type: 'POST',
            url: '/contratos/editar/', // URL para editar el contrato
            data: {
                contrato_id: contratoId,
                estado: nuevoEstado,
                csrfmiddlewaretoken: csrfToken
            },
            success: function(response) {
                // Mostrar mensaje de éxito y redirigir a la lista de contratos
                alert(response.message);
                window.location.href = "/contratos/"; // Redirigir a la URL de la lista de contratos
            },
            error: function(xhr) {
                // Manejar errores
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Error inesperado al editar el contrato.';
                alert(errorMessage);
            }
        });
    });
});