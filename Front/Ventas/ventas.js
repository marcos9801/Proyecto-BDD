var cookies = document.cookie.split(';');
var cookie = null;

for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
        cookie = cookie.substring("token=".length);
        break;
    }
}
boton = document.getElementById('btnAgregarVenta');
boton.addEventListener('click', function(){
    location.href = 'venta_anadir.html';
});
console.log(cookie);
obtener_ventas();
function obtener_ventas(){
        
    fetch('http://127.0.0.1:8000/ventas/', {
    method: 'GET',
    headers: {
        'Authorization': `Token ${cookie}` 
    }
    }).then(response => response.json())
    .then(data => {
        ventas=data;
        const tabla = document.getElementById('tabla-lista-ventas');

        ventas.forEach(ventas => {
        const fila = tabla.insertRow(); // Insertar una nueva fila en la tabla
        console.log(ventas);
        // Agregar las celdas con los datos del ventas a la fila
        fila.insertCell().textContent = ventas.id;
        fila.insertCell().textContent = ventas.fecha_venta;
        fila.insertCell().textContent = ventas.cliente;
        fila.insertCell().textContent = ventas.total;
        
        const btnEditar = document.createElement('button');
        btnEditar.id = 'editarventas_' + ventas.id; 
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', function() {
            location.href = `editar.html?id=${ventas.id}`; 
        });
        fila.insertCell().appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.id = 'eliminarventas_' + ventas.id; 
        btnEliminar.textContent = 'eliminar';
        btnEliminar.addEventListener('click', function() {
            Eliminarventas(ventas.id);
        });
        fila.insertCell().appendChild(btnEliminar);
        
    });
    })
    .catch(error => {
        
    });

}
function Eliminarventas(id) {
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
        console.error('Error al eliminar ventas:', error);
    });
}


