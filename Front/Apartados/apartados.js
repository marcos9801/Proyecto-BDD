var cookies = document.cookie.split(';');
var cookie = null;

for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
        cookie = cookie.substring("token=".length);
        break;
    }
}
obtener_apartados();
function obtener_apartados(){
        
    fetch('http://127.0.0.1:8000/apartados/', {
    method: 'GET',
    headers: {
        'Authorization': `Token ${cookie}` 
    }
    }).then(response => response.json())
    .then(data => {
        apartados=data;
        const tabla = document.getElementById('tabla-lista-apartados');

        apartados.forEach(apartados => {
        const fila = tabla.insertRow(); // Insertar una nueva fila en la tabla

        // Agregar las celdas con los datos del apartados a la fila
        fila.insertCell().textContent = apartados.id;
        fila.insertCell().textContent = apartados.fecha_apartado;
        fila.insertCell().textContent = apartados.fecha_limite;
        fila.insertCell().textContent = apartados.cliente;
        fila.insertCell().textContent = apartados.total;
        
        const btnEditar = document.createElement('button');
        btnEditar.id = 'editarapartados_' + apartados.id; 
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', function() {
            location.href = `editar.html?id=${apartados.id}`; 
        });
        fila.insertCell().appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.id = 'eliminarapartados_' + apartados.id; 
        btnEliminar.textContent = 'eliminar';
        btnEliminar.addEventListener('click', function() {
            Eliminarapartados(apartados.id);
        });
        fila.insertCell().appendChild(btnEliminar);
        
    });
    })
    .catch(error => {
        
    });

}
function Eliminarapartados(id) {
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
        console.error('Error al eliminar apartados:', error);
    });
}


