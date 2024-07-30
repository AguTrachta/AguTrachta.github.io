// app.js

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    // Aquí se enviarán los datos al backend para registrar al usuario
    console.log('Registrarse:', email, password);
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // Aquí se enviarán los datos al backend para iniciar sesión
    console.log('Iniciar Sesión:', email, password);
});

document.getElementById('audio-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    // Aquí se manejará la subida del archivo de audio
    console.log('Archivo subido:', file);
});

document.getElementById('start-recording').addEventListener('click', function() {
    // Aquí se iniciará la grabación de audio
    console.log('Iniciar grabación');
});

document.getElementById('stop-recording').addEventListener('click', function() {
    // Aquí se detendrá la grabación de audio
    console.log('Detener grabación');
});

document.getElementById('generate-pdf').addEventListener('click', function() {
    // Aquí se generará el PDF con la transcripción
    console.log('Generar PDF');
});
