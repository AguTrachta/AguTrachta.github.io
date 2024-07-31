// app.js

document.getElementById('audio-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const audioContent = event.target.result.split(',')[1];

        fetch('https://us-central1-decent-glazing-431020-n5.cloudfunctions.net/transcribeAudio'
            , {  // Reemplaza con la URL de la función de Firebase
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ audioContent })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('transcription-text').textContent = data.transcription;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    reader.readAsDataURL(file);
});

document.getElementById('generate-pdf').addEventListener('click', function() {
    // Aquí se generará el PDF con la transcripción
    console.log('Generar PDF');
});
