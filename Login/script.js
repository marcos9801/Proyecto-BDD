      // Obtenemos el formulario por su id
      var loginForm = document.getElementById('loginForm');
      
      // Agregamos un evento 'submit' al formulario
      loginForm.addEventListener('submit', function(event) {
        // Prevenimos el comportamiento por defecto del formulario (enviarlo)
        event.preventDefault();
        // Redireccionamos a la página deseada
        window.location.href = 'prueba.html';
      });