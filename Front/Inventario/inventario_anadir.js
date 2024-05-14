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
document.addEventListener("DOMContentLoaded", function() {
    cargarCategorias();

    document.getElementById("submit").addEventListener('click', agregarProducto);
    
});
async function agregarProducto() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("cantidad").value;
    const categoria = document.getElementById("categoria").value;
    const descripcion = document.getElementById("descripcion").value;
    const imagenInput = document.getElementById("imagen");
    const imagen = imagenInput.files[0]; // Obtener el primer archivo seleccionado
    const material = document.getElementById("material").value;
    // Crear un objeto FormData para enviar los datos del formulario, incluida la imagen
    var formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', precio);
    formData.append('cantidad', stock);
    formData.append('categoria', categoria);
    formData.append('descripcion', descripcion);
    formData.append('material', material);
    formData.append('imagen', imagen);
    try {
        const response = await fetch("http://127.0.0.1:8000/productos/anadir", {
            method: "POST",
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
    
}
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
        categoria=data;
        select=document.getElementById("categoria");
        categoria.forEach(async (categoria) => {
            let option = document.createElement("option");
            option.text = categoria.nombre;
            option.value = categoria.id;
            await select.appendChild(option);
        });
    } else {
        throw new Error("No se pudo obtener la lista de categorías.");
    }
    } catch (error) {
    console.error("Error al cargar las categorías:", error);
    }
}