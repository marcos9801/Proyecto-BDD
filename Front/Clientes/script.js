var cookies = document.cookie.split(';');
var cookie = null;

for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
        cookie = cookie.substring("token=".length);
        break;
    }
}

console.log(cookie);
obtener_clientes();
var clientes=[];

//crea la lista de clientes al abrir la pagina
function obtener_clientes(){
        
        fetch('http://127.0.0.1:8000/clientes/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${cookie}` 
        }
        }).then(response => response.json())
        .then(data => {
            clientes=data;
            const tabla = document.getElementById('tabla-lista-clientes');

            clientes.forEach(cliente => {
            const fila = tabla.insertRow(); // Insertar una nueva fila en la tabla

            // Agregar las celdas con los datos del cliente a la fila
            fila.insertCell().textContent = cliente.id;
            fila.insertCell().textContent = cliente.nombre;
            fila.insertCell().textContent = cliente.correo;
            fila.insertCell().textContent = cliente.telefono;
            if (cliente.direccion === null) {
                fila.insertCell().textContent = 'N/A';
            }
            else{
                fila.insertCell().textContent = cliente.direccion.direccion +  ', ' + cliente.direccion.codigo_postal+ ', ' +cliente.direccion.colonia+', '+ cliente.direccion.ciudad   + ', '+cliente.direccion.estado+', ' + cliente.direccion.pais ;
            }
            // Agregar un botón de editar en la última celda de la fila
            const btnEditar = document.createElement('button');
            btnEditar.id = 'editarCliente_' + cliente.id; 
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function() {
                window.location.href = `../Clientes/editar.html?id=${cliente.id}`;
            });
            fila.insertCell().appendChild(btnEditar);

            const btnEliminar = document.createElement('button');
            btnEliminar.id = 'eliminarCliente_' + cliente.id; 
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.addEventListener('click', function() {
                EliminarCliente(cliente.id);
            });
            fila.insertCell().appendChild(btnEliminar);
            
        });
        })
        .catch(error => {
            
        });

    }
    function EliminarCliente(id) {
        const data = { id: id };
        fetch(`http://127.0.0.1:8000/clientes/eliminar`, {
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
    

