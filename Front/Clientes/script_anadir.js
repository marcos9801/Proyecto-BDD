const cookie = document.cookie.substring(document.cookie.lastIndexOf(" token=") + 7);

document.addEventListener('DOMContentLoaded', function() {
    const checkboxDireccion = document.getElementById('checkboxDireccion');
    const direccionFields = document.getElementById('direccionFields').getElementsByTagName('input');

    // Función para habilitar o deshabilitar los campos de dirección
    function toggleDireccionFields() {
        for (let i = 0; i < direccionFields.length; i++) {
            direccionFields[i].disabled = !checkboxDireccion.checked;
        }
    }
    toggleDireccionFields();

    // Agregar un evento de cambio al checkbox
    checkboxDireccion.addEventListener('change', toggleDireccionFields);
});
window.onload = function() {
    document.getElementById("botonGuardar").addEventListener('click', guardar_cliente);}
async function guardar_cliente(){
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    if(checkboxDireccion.checked ){
        const direccion = document.getElementById('direccion').value;
        const colonia = document.getElementById('colonia').value;
        const ciudad  = document.getElementById('ciudad').value;
        const estado  = document.getElementById('estado').value;
        const cp = document.getElementById('cp').value;
        const pais = document.getElementById('pais').value;
        data={
            "nombre":nombre,
            "correo":correo,
            "telefono":telefono,
            "direccion":direccion,
            "colonia":colonia,
            "ciudad":ciudad,
            "estado":estado,
            "codigo_postal": cp,
            "pais": pais
        }
    }
    else{
        data={
            "nombre":nombre,
            "correo":correo,
            "telefono":telefono,
        }
    }
    try {
    const response= await fetch("http://127.0.0.1:8000//clientes/anadir", {
        method:"POST",
        headers:{
            'Authorization': `Token ${cookie}`,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    })
    response = await response.json();
    location.href = `clientes.html`;
    }
    catch
    {
        console.error('Error al añadir clientes:');
    }
}

