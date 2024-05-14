cookie=document.cookie.substring(document.cookie.lastIndexOf(" token=")+7) ;
cookie = cookie.substring(0, cookie.indexOf(';'));
console.log(cookie);
obtener_apartados();
var clientes=[];

//crea la lista de clientes al abrir la pagina
function obtener_apartados(){
        
        fetch('http://127.0.0.1:8000/apartados/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${cookie}` 
        }
        }).then(response => response.json())
        .then(data => {
            clientes=data;
            const tabla = document.getElementById('tabla-lista-apartados');

            clientes.forEach(apartado => {
            const fila = tabla.insertRow(); // Insertar una nueva fila en la tabla
            console.log(apartado);
            // Agregar las celdas con los datos del cliente a la fila
            fila.insertCell().textContent = apartado.id;
            fila.insertCell().textContent = apartado.fecha_apartado;
            fila.insertCell().textContent = "$ "+apartado.fecha_limite;
            
            fila.insertCell().textContent = apartado.cliente;
            fila.insertCell().textContent = "$ "+apartado.total;

            const btnEditar = document.createElement('button');
            btnEditar.id = 'editarapartado_' + apartado.id; 
            btnEditar.textContent = 'Editar';
            btnEditar.addEventListener('click', function() {
                location.href = `editar.html?id=${apartado.id}`; 
            });
            fila.insertCell().appendChild(btnEditar);

            const btnEliminar = document.createElement('button');
            btnEliminar.id = 'eliminarapartado_' + apartado.id; 
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
    function Eliminarapartado(id) {
        const data = { id: id };
        fetch(`http://127.0.0.1:8000/apartados/eliminar`, {
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
    

