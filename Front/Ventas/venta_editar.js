var cookies = document.cookie.split(';');
var cookie = null;
var venta;

for (var i = 0; i < cookies.length; i++) {
    var cookieItem = cookies[i].trim();
    if (cookieItem.startsWith("token=")) {
        cookie = cookieItem.substring("token=".length);
        break;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    obtenerClientes();
    obtenerVenta();
    const botonGuardar = document.getElementById("botonGuardar");
    botonGuardar.addEventListener("click", actualizarVenta);
});

async function actualizarVenta() {
    event.preventDefault()
    if (!venta) {
        console.error("No se puede actualizar la venta. Venta no encontrada.");
        return;
    }
    
    const id = venta.id;
    const fecha_venta = document.getElementById("fecha_venta").value;
    const total = document.getElementById("total").value;
    const cliente = document.getElementById("cliente").value;
    const detalles_venta = [];
    const divProductos = document.getElementById("detalles_venta");
    const productos = Array.from(divProductos.getElementsByClassName("producto"));

    productos.forEach(producto => {
        const inputNombre = producto.getElementsByTagName("input")[0];
        const inputPrecio = producto.getElementsByTagName("input")[1];
        const inputCantidad = producto.getElementsByTagName("input")[2];
        const inputSubtotal = producto.getElementsByTagName("input")[3];

        const detalle = {
            producto: {
                id: inputNombre.dataset.productId // Suponiendo que el ID del producto está almacenado en un atributo data
            },
            cantidad: inputCantidad.value,
            subtotal: inputSubtotal.value,
        };

        detalles_venta.push(detalle);
    });

    const data = {
        id: id,
        fecha_venta: fecha_venta,
        total: total,
        cliente: cliente,
        detalleventa_set: detalles_venta,
    };
    console.log(data);

    try {
        const response = await fetch(`http://127.0.0.1:8000/ventas/editar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookie}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("Venta actualizada correctamente.");
            location.href = "ventas.html";
        } else {
            throw new Error("Error al actualizar la venta.");
        }
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
    }
}

async function cargarProductos() {
    if (!venta) {
        console.error("No se puede cargar productos. Venta no encontrada.");
        return;
    }

    const detallesVenta = venta["detalleventa_set"];
    const divProductos = document.getElementById("detalles_venta");
    
    // Limpiar el contenedor de productos antes de agregar nuevos elementos
    divProductos.innerHTML = '';

    detallesVenta.forEach(detalle => {
        const producto = detalle.producto;
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");
        divProductos.appendChild(divProducto);

        const inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.value = producto.nombre;
        inputNombre.disabled = true;
        inputNombre.dataset.productId = producto.id; // Agregar ID del producto en dataset
        divProducto.appendChild(inputNombre);

        const inputPrecio = document.createElement("input");
        inputPrecio.type = "number";
        inputPrecio.value = producto.precio;
        inputPrecio.disabled = true;
        divProducto.appendChild(inputPrecio);

        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.value = detalle.cantidad;
        divProducto.appendChild(inputCantidad);

        const inputSubtotal = document.createElement("input");
        inputSubtotal.type = "number";
        inputSubtotal.value = detalle.subtotal;
        inputSubtotal.disabled = true;
        divProducto.appendChild(inputSubtotal);

        inputCantidad.addEventListener("change", function() {
            const cantidad = inputCantidad.value;
            const precio = inputPrecio.value;
            const subtotal = cantidad * precio;
            inputSubtotal.value = subtotal;
        });

        const buttonEliminar = document.createElement("button");
        buttonEliminar.textContent = "Eliminar";
        buttonEliminar.addEventListener("click", function() {
            divProductos.removeChild(divProducto);
        });
        divProducto.appendChild(buttonEliminar);
    });
}

async function obtenerVenta() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(id);
    try {
        const response = await fetch(`http://127.0.0.1:8000/ventas/?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Token " + cookie,
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            venta = data;
            seleccionarCliente();
            document.getElementById("fecha_venta").value = data.fecha_venta;
            document.getElementById("total").value = data.total;
            cargarProductos();
        } else {
            throw new Error("No se pudo obtener la venta.");
        }
    } catch (error) {
        console.error("Error al obtener la venta:", error);
    }
}

function obtenerClientes() {
    fetch('http://127.0.0.1:8000/clientes/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${cookie}` 
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

function seleccionarCliente() {
    if (!venta || !venta.cliente) {
        console.error("No se puede seleccionar el cliente. Venta o cliente no encontrados.");
        return;
    }
    const selectCliente = document.getElementById("cliente");
    const valorDeseado = venta.cliente.toString();
    for (let i = 0; i < selectCliente.options.length; i++) {
        if (selectCliente.options[i].value === valorDeseado) {
            selectCliente.selectedIndex = i;
            break;
        }
    }
}
