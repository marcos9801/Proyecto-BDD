
      var loginForm = document.getElementById('loginForm');

    // Agregamos un evento 'submit' al formulario
      loginForm.addEventListener('submit', function(event) {
      // Evitar que se envíe el formulario y se recargue la página
      event.preventDefault();
      var usuario = document.getElementById('user').value;
      var password = document.getElementById('password').value;
      fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: usuario,
          password: password
        })
      }).then(response => response.json())
        .then(data => {
          console.log(usuario);
          console.log(password);
          const token = data.token;
          console.log('Token:', token);
          if (!token) {
            alert('Usuario o contraseña incorrectos');
            return;
          }
          document.cookie = `token=${token}; path=/`;
          window.location.href = '../Pagina principal/principal.html';
          // Guardar el token en el almacenamiento local (LocalStorage o Cookies)
        })
        .catch(error => {
          console.error('Error:', error);
          console.log(usuario);
          console.log(password);
        });
    });

