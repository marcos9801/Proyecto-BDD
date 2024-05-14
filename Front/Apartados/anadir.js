var cookies = document.cookie.split(';');
var cookie = null;

for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
        cookie = cookie.substring("token=".length);
        break;
    }
}

function enviarFormulario(event) {
    event.preventDefault();

    // Obtener la información del formulario
    const clienteSeleccionado = document.getElementById('cliente').value;
    const fechaLimite = document.getElementById('fecha_limite').value;

    // Obtener los productos y cantidades ingresados
    const productosCantidad = [];
    document.querySelectorAll('.producto input').forEach(input => {
        const idProducto = input.id.split('_')[1];
        const cantidad = input.value;
        if (cantidad === '0') {
            return; // Ignorar los productos con cantidad 0
        }
        productosCantidad.push({ producto: idProducto, cantidad: cantidad });
    });

    // Construir el objeto JSON con la información recopilada
    const data = {
        cliente: clienteSeleccionado,
        status: 1,
        fecha_apartado: new Date().toISOString().split('T')[0],
        fecha_limite: fechaLimite,
        productos: productosCantidad.map(item => `${item.producto} - ${item.cantidad}`)
    };
    

    // Convertir el objeto a formato JSON
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    Enviar(jsonData);

    // Aquí puedes hacer lo que necesites con el JSON, como enviarlo a una API
    async function Enviar(jsonData) {
        try {
            const response = await fetch('http://127.0.0.1:8000/apartados/anadir', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${cookie}`, 
                    'Content-Type': 'application/json'
                },
                body: jsonData,
            });
            if (!response.ok) {
                throw new Error('');
            }
            const data = await response.json();
            // Almacenar los productos en la variable global
            productos = data;
            
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }
}

window.onload = function() {
    const boton = document.getElementById('ingresar');
    boton.addEventListener('click', enviarFormulario);
}

// Variable para almacenar los productos
let productos = [];
obtenerProductos();

// Función para obtener los productos
async function obtenerProductos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/productos/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${cookie}` 
            }
        });
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de productos');
        }
        const data = await response.json();
        // Almacenar los productos en la variable global
        productos = data;
        // Llamar a la función para actualizar el contenedor con los productos obtenidos
        actualizarContenedorProductos(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

// Función para actualizar el contenedor con los productos
function actualizarContenedorProductos(productos) {
    // Obtener la referencia al contenedor de productos en el HTML
    const contenedorProductos = document.getElementById('contenedor-productos');

    // Limpiar cualquier contenido previamente agregado
    contenedorProductos.innerHTML = '';

    // Iterar sobre los productos y crear un elemento <label> con un <input> para cada uno
    productos.forEach(producto => {
        // Crear un nuevo elemento <div> para contener el producto y su cantidad
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto'); // Agregar una clase para aplicar estilos

        // Crear un nuevo elemento <label> para el nombre del producto
        const labelProducto = document.createElement('label');
        labelProducto.textContent = producto.nombre;
        labelProducto.htmlFor = 'cantidad_' + producto.id; // Asignar un ID único al label

        // Crear un nuevo elemento <input> para ingresar la cantidad
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = '0';
        inputCantidad.value = '0'; // Valor por defecto
        inputCantidad.id = 'cantidad_' + producto.id; // Asignar un ID único al input
        inputCantidad.name = 'cantidad_' + producto.id; // Asignar un nombre único al input

        // Agregar el label y el input al divProducto
        divProducto.appendChild(labelProducto);
        divProducto.appendChild(inputCantidad);

        // Agregar el divProducto al contenedor de productos
        contenedorProductos.appendChild(divProducto);
    });
}

// Llamar a la función para obtener clientes al cargar la página
obtener_clientes();

// Función para obtener clientes y cargarlos en el select
async function obtener_clientes() {
    fetch('http://127.0.0.1:8000/clientes/', {
        method: 'GET',
        headers: {
            'Authorization': `Token ${cookie}` 
        }
    })
    .then(response => response.json())
    .then(data => {
        // Obtiene la referencia al elemento <select> en el HTML
        const select = document.getElementById('cliente');

        // Itera sobre los datos de los clientes obtenidos del servidor
        data.forEach(cliente => {
            // Crea un nuevo elemento <option> para cada cliente
            const option = document.createElement('option');
            option.text = cliente.nombre;
            option.value = cliente.id;

            // Agrega la opción al elemento <select>
            select.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al obtener clientes:', error);
    });
}
