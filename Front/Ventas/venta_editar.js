document.addEventListener("DOMContentLoaded", function() {
    cargarCategorias();
    obtenerVenta();
    
    document.getElementById("botonGuardar").addEventListener('click', actualizarVenta);
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

async function actualizarVenta() {
    const cliente = document.getElementById("cliente").value;
    const fecha_venta = document.getElementById("fecha_venta").value;
    const total = document.getElementById("total").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/ventas/editar", {
            method: "PUT",
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
            alert("Venta actualizada exitosamente.");
        } else {
            throw new Error("Error al actualizar la venta.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function obtenerVenta() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(id);
    try {
        const response = await fetch(`http://127.0.0.1:8000/ventas/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            document.getElementById("cliente").value = data.cliente;
            document.getElementById("fecha_venta").value = data.fecha_venta;
            document.getElementById("total").value = data.total;
        } else {
            throw new Error("No se pudo obtener la venta.");
        }
    } catch (error) {
        console.error("Error al obtener la venta:", error);
    }
}
