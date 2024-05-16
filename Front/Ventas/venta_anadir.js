var cookies = document.cookie.split(';');
var token = null; // Cambié el nombre de la variable para evitar confusiones con la palabra reservada "cookie"
var productos = [];

for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
        token = cookie.substring("token=".length);
        break;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    obtenerClientes();
    obtenerProductos();

    document.getElementById("submit").addEventListener('click', guardarVenta); // Corregí el nombre de la función aquí
    
});

async function guardarVenta() {
    const cliente = document.getElementById('cliente').value;
    const fecha_venta = document.getElementById('fecha_venta').value;
    const total = document.getElementById('total').value;
    const detalle_venta = [];

    productos.forEach(producto => {
        const cantidad = document.getElementsByName(`cantidad_${producto.id}`)[0].value;
        if (cantidad > 0) {
            detalle_venta.push(`${producto.id} - ${cantidad}`);
        }
    });

    try {
        console.log(JSON.stringify({
            cliente: cliente,
            fecha_venta: fecha_venta,
            productos: detalle_venta,
        }));
        const response = await fetch('http://127.0.0.1:8000/ventas/anadir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                cliente: cliente,
                fecha_venta: fecha_venta,
                productos: detalle_venta,
            })
        });

        if (response.ok) {
            alert('Venta agregada exitosamente.');
            location.href = 'ventas.html';
        } else {
            throw new Error('Error al agregar la venta.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



function obtenerClientes() {
    fetch('http://127.0.0.1:8000/clientes/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}` // Usar la variable "token" en lugar de "cookie"
        }
    }).then(response => response.json())
    .then(data => {
        const selectCliente = document.getElementById('cliente');
        data.forEach(cliente => {
            let option = document.createElement('option');
            option.value = cliente.id;
            option.text = cliente.nombre;
            selectCliente.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error al obtener los clientes:", error);
    });
}

async function obtenerProductos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/productos/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}` // Usar la variable "token" en lugar de "cookie"
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo obtener la lista');
        }

        const data = await response.json();
        productos = data;

        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            const option = document.createElement('div');
            option.value = producto.id;
            option.textContent = producto.nombre;

            const inputNumero = document.createElement('input');
            inputNumero.type = 'number';
            inputNumero.name = `cantidad_${producto.id}`;
            inputNumero.min = '0';
            inputNumero.value = '0';

            option.appendChild(inputNumero);
            document.getElementById('detalle_venta').appendChild(option);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}
