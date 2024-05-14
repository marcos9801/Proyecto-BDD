cookie=document.cookie.substring(document.cookie.lastIndexOf(" token=")+7) ;
cookie = cookie.substring(0, cookie.indexOf(';'));
console.log(cookie);
obtener_ventas();
var clientes=[];

//crea la lista de clientes al abrir la pagina
function obtener_ventas(){
        
        fetch('http://127.0.0.1:8000/ventas/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${cookie}` 
        }
        }).then(response => response.json())
        .then(data => {
            clientes=data;
            const tabla = document.getElementById('tabla-lista-ventas');

            clientes.forEach(venta => {
            const fila = tabla.insertRow(); // Insertar una nueva fila en la tabla
            console.log(venta);
            // Agregar las celdas con los datos del cliente a la fila
            fila.insertCell().textContent = venta.id;
            fila.insertCell().textContent = venta.fecha_venta;
            fila.insertCell().textContent = "$ "+venta.total;
            fila.insertCell().textContent = venta.cliente;

            const btnEditar = document.createElement('button');
            btnEditar.id = 'editarVenta_' + venta.id; 
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function() {
                location.href = `editar.html?id=${venta.id}`; 
            });
            fila.insertCell().appendChild(btnEditar);

            const btnEliminar = document.createElement('button');
            btnEliminar.id = 'eliminarVenta_' + venta.id; 
            btnEliminar.textContent = 'eliminar';
            btnEliminar.addEventListener('click', function() {
                EliminarCliente(cliente.id);
            });
            fila.insertCell().appendChild(btnEliminar);
            
        });
        })
        .catch(error => {
            
        });

    }
    function EliminarVenta(id) {
        const data = { id: id };
        fetch(`http://127.0.0.1:8000/ventas/eliminar`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${cookie}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        })
        .then(response => response.json())
        .then(data => {
            // Hacer algo con la respuesta del servidor si es necesario
        })
        .catch(error => {
            console.error('Error al eliminar cliente:', error);
        });
    }
    

