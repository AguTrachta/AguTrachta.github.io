// app.js

document.getElementById('audio-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('audio', file);

    fetch('/transcribe', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('transcription-text').textContent = data.transcription;
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
