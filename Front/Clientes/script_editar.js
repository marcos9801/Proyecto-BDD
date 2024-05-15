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
// Array para almacenar los clientes
let clientes = [];

// Función para obtener los clientes
async function obtener_clientes(id) {
    try {
        console.log('Obteniendo clientes...');
        const response = await fetch(`http://127.0.0.1:8000/clientes?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${cookie}`
            }
        });
        clientes = await response.json();
        console.log('Clientes:', clientes);
        poner_informacion(id); // Llamar a la función para mostrar información después de obtener los clientes
    } catch (error) {
        console.error('Error al obtener clientes:', error);
    }
}

// Función para actualizar un cliente
async function actualizar_cliente() {

    console.log('Actualizando cliente...');
    
    const id = new URLSearchParams(window.location.search).get('id');
    const nombre = document.getElementById('name').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const colonia = document.getElementById('colonia').value;
    const ciudad = document.getElementById('ciudad').value;
    const estado = document.getElementById('estado').value;
    const cp = document.getElementById('cp').value;
    const pais = document.getElementById('pais').value;
    
    const data = { 
            "id": id,
            "nombre": nombre,
            "correo": correo,
            "telefono": telefono,
            "direccion": direccion,
            "colonia": colonia,
            "ciudad": ciudad,
            "estado": estado,
            "pais": pais,
            "codigo_postal": cp
    };

    console.log(data);

    const response = await fetch(`http://127.0.0.1:8000/clientes/editar`, {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${cookie}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    const resp = await response.json();
    location.href = `clientes.html`;
}


// Función para mostrar la información de un cliente
function poner_informacion() {
    cliente = clientes;
    if (cliente) {
        document.getElementById('name').value = cliente.nombre;
        document.getElementById('correo').value = cliente.correo;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('direccion').value = cliente.direccion.direccion;
        document.getElementById('colonia').value = cliente.direccion.colonia;
        document.getElementById('ciudad').value = cliente.direccion.ciudad;
        document.getElementById('estado').value = cliente.direccion.estado;
        document.getElementById('cp').value = cliente.direccion.codigo_postal;
        document.getElementById('pais').value = cliente.direccion.pais;
    } else {
        console.log('Cliente no encontrado');
    }
}
function obtener_id_cliente() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) {
        obtener_clientes(id); // Llamar a la función para obtener clientes cuando se haya obtenido el ID
    } else {
        console.log('No se encontró el parámetro "id" en la URL');
    }
}

// Al cargar la página, obtener el ID del cliente y luego obtener los clientes
window.onload = function() {
    document.getElementById("botonGuardar").addEventListener('click', actualizar_cliente);
    obtener_id_cliente();
    //document.getElementById("botonGuardar").addEventListener('click', actualizar_cliente(3));
};

