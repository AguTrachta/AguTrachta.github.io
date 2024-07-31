// Importar las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";

// Configuración de Firebase de tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyDufmFSegCK1tJ3o692pYBC8yXDBMloFvY",
  authDomain: "decent-glazing-431020-n5.firebaseapp.com",
  projectId: "decent-glazing-431020-n5",
  storageBucket: "decent-glazing-431020-n5.appspot.com",
  messagingSenderId: "39297025905",
  appId: "1:39297025905:web:86414a0c8e7441ebcdd8d0",
  measurementId: "G-3GN2J130FK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Código para manejar la grabación de audio y transcripción
let mediaRecorder;
let audioChunks = [];

document.getElementById('start-recording').addEventListener('click', () => {
    console.log("Start recording clicked");
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            console.log("MediaRecorder started");
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
                console.log("Audio chunk collected");
            };
        })
        .catch(error => console.error('Error al acceder al micrófono:', error));
});

document.getElementById('stop-recording').addEventListener('click', () => {
    console.log("Stop recording clicked");
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped");
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

        const formData = new FormData();
        formData.append('audio', audioFile);

        console.log("Sending audio to server...");

        fetch('https://us-central1-decent-glazing-431020-n5.cloudfunctions.net/app/transcribe', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("Server response:", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Received transcription:", data.transcription);
            document.getElementById('transcription-text').value = data.transcription;
        })
        .catch(error => {
            console.error('Error al subir el audio:', error);
        });
    };
});
