var cookies = document.cookie.split(';');
var cookie = null;

for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("token=")) {
        cookie = cookie.substring("token=".length);
        break;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    cargarCategorias();

    document.getElementById("submit").addEventListener('click', agregarVenta);
    
});

async function agregarVenta() {
    const cliente = document.getElementById("cliente").value;
    const fecha_venta = document.getElementById("fecha_venta").value;
    const total = document.getElementById("total").value;

    // Puedes agregar lógica para obtener los detalles de la venta aquí
    
    try {
        const response = await fetch("http://127.0.0.1:8000/ventas/agregar", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cliente: cliente,
                fecha_venta: fecha_venta,
                total: total,
            }),
        });
        if (response.ok) {
            alert("Venta agregada exitosamente.");
            // Redirige a donde desees después de agregar la venta
            // location.href = "ruta_a_redirigir_despues_de_agregar_venta";
        } else {
            throw new Error("Error al agregar la venta.");
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
            },
        });
        if (response.ok) {
            const categorias = await response.json();
            const select = document.getElementById("categoria");
            categorias.forEach(categoria => {
                let option = document.createElement("option");
                option.text = categoria.nombre;
                option.value = categoria.id;
                select.appendChild(option);
            });
        } else {
            throw new Error("No se pudo obtener la lista de categorías.");
        }
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}
