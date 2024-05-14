cookie=document.cookie.substring(document.cookie.lastIndexOf(" token=")+7) ;
cookie = cookie.substring(0, cookie.indexOf(';'));
document.addEventListener("DOMContentLoaded", function() {
    cargarCategorias();
    obtenerProductos();
    
    
    document.getElementById("botonGuardar").addEventListener('click', actualizarProducto);
    const nuevaCategoriaCheckbox = document.getElementById("nuevaCategoriaCheckbox");
    const nuevaCategoriaInput = document.getElementById("nuevaCategoriaInput");
    
    nuevaCategoriaCheckbox.addEventListener("change", function() {
        nuevaCategoriaInput.disabled = !nuevaCategoriaCheckbox.checked;
        nuevaCategoriaInput.value = ""; 
    });
});
    
async function cargarCategorias() {
    try {
        const response = await fetch("http://127.0.0.1:8000/productos/categorias", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + cookie,
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const categoriaSelect = document.getElementById("categoriaSelect");
            
            data.forEach(categoria => {
                const option = document.createElement("option");
                option.text = categoria.nombre;
                option.value = categoria.id;
                categoriaSelect.appendChild(option);
            });
        } else {
            throw new Error("No se pudo obtener la lista de categorías.");
        }
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

async function actualizarProducto() {
    const id = producto.id;
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("cantidad").value;
    const categoria = document.getElementById("categoriaSelect").value;
    const descripcion = document.getElementById("descripcion").value;
    const imagenInput = document.getElementById("imagen");
    const imagen = imagenInput.files[0]; // Obtener el primer archivo seleccionado
    const material = document.getElementById("material").value;

    // Crear un objeto FormData para enviar los datos del formulario, incluida la imagen
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('cantidad', stock);
    formData.append('categoria', categoria);
    formData.append('descripcion', descripcion);
    formData.append('material', material);
    formData.append('imagen', imagen);

    try {
        const response = await fetch("http://127.0.0.1:8000/productos/editar", {
            method: "PUT", // Cambiado de PUT a POST
            headers: {
                'Authorization': 'Token ' + cookie,
            },
            body: formData,
        });
        if (response.ok) {
            alert("Producto agregado exitosamente.");
            //location.href = "inventario.html";
        } else {
            throw new Error("Error al agregar el producto.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

async function obtenerProductos() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(id);


    try{
        const response = await fetch(`http://127.0.0.1:8000/productos/?id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${cookie}` 
            },
    
        });
        if(!response.ok){
            throw new Error('No se pudo obtener la lista')
        }
        const data = await response.json();
        producto = data
        console.log(producto);
        document.getElementById("nombre").value = producto.nombre;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("cantidad").value = producto.cantidad;
        document.getElementById("categoriaSelect").value = producto.categoria;
        document.getElementById("descripcion").value = producto.descripcion;
        document.getElementById("material").value = producto.material;
    }catch(error){
        console.error('Error al obtener productos:', error);
    }
        
}


