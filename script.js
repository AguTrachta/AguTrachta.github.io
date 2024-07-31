// Importar las funciones necesarias de los SDKs de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
