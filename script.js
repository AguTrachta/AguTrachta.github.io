let mediaRecorder;
let audioChunks = [];

document.getElementById('start-recording').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
        })
        .catch(error => console.error('Error al acceder al micrófono:', error));
});

document.getElementById('stop-recording').addEventListener('click', () => {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
        
        const formData = new FormData();
        formData.append('audio', audioFile);

        fetch('https://us-central1-decent-glazing-431020-n5.cloudfunctions.net/app/transcribe', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('transcription-text').value = data.transcription;
        })
        .catch(error => console.error('Error al subir el audio:', error));
    };
});
