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
// Variable para almacenar los productos
let productos = [];

// Función para obtener los productos
async function obtenerProductos() {

    try{
        const response = await fetch('http://127.0.0.1:8000/productos/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${cookie}` 
            }
        });
        if(!response.ok){
            throw new Error('No se pudo obtener la lista')
        }
        const data = await response.json();
        productos = data
        mostrarProductos(productos);
    }catch(error){
        console.error('Error al obtener productos:', error);
    }
        
}

// Función para mostrar los productos en la página
function mostrarProductos(productos) {
    const contenedorProducto= document.getElementById("contenedor-productos")
    productos.forEach(producto => {
        console.log(producto);

        const tarjetaProducto = document.createElement('class');
        tarjetaProducto.classList.add("tarjeta-producto");
        const tituloProducto =document.createElement('h2');
        tituloProducto.textContent=producto.nombre;
        const descripcionProducto=document.createElement('p');
        descripcionProducto.textContent=producto.descripcion;
        const precioProducto = document.createElement('p');
        precioProducto.textContent="$"+producto.precio;
        const categoriaProducto=document.createElement('p');
        categoriaProducto.textContent=producto.categoria.nombre;
        const contenedorBotones = document.createElement('class');
        contenedorBotones.classList.add("contenedor-botones");
        const botonEditar=document.createElement('button');
        botonEditar.textContent="Editar";
        const cantidad=document.createElement('p');
        cantidad.textContent="Cantidad en stock: "+producto.cantidad;
        botonEditar.addEventListener('click', function() {
            location.href = `editar.html?id=${producto.id}`; 
        });
        const botonEliminar=document.createElement('button');
        botonEliminar.textContent="Eliminar";
        botonEliminar.addEventListener('click', function(){
            EliminarProducto(producto.id)});
        const imagen=document.createElement('img');
        imagen.src = "http://127.0.0.1:5500/Backend/"+producto.imagen;

        tarjetaProducto.appendChild(tituloProducto);
        tarjetaProducto.appendChild(categoriaProducto);
        tarjetaProducto.appendChild(imagen)
        tarjetaProducto.appendChild(descripcionProducto);
        tarjetaProducto.appendChild(precioProducto);
        tarjetaProducto.appendChild(cantidad);
        contenedorBotones.appendChild(botonEditar);
        contenedorBotones.appendChild(botonEliminar);
        tarjetaProducto.appendChild(contenedorBotones);
        contenedorProducto.appendChild(tarjetaProducto);

        // Mostrar más detalles si es necesario
    });
}

// Llamar a la función para obtener los productos cuando se cargue 
document.addEventListener("DOMContentLoaded", function() {
    btnAgregar=document.getElementById("btn-agregar");
    btnAgregar.addEventListener('click',function(){
        location.href="anadir_producto.html";
    })
    obtenerProductos();
});
function EliminarProducto(id) {
    const data = { id: id };
    fetch(`http://127.0.0.1:8000/productos/eliminar`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${cookie}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error al eliminar cliente:', error);
    });
}