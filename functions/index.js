const functions = require('firebase-functions');
const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Inicializar Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Inicializar Google Cloud Speech-to-Text
const client = new SpeechClient();

// Configurar Express y Multer
const app = express();
const upload = multer({ dest: os.tmpdir() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const audioFilePath = req.file.path;
  const audioBytes = fs.readFileSync(audioFilePath).toString('base64');

  const audio = {
    content: audioBytes
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'es-ES',
  };
  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
    
    // Guardar en Firestore
    const docRef = db.collection('transcriptions').doc();
    await docRef.set({
      transcription: transcription,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ transcription });
  } catch (error) {
    console.error('Error al transcribir audio:', error);
    res.status(500).json({ error: 'Error al transcribir audio' });
  } finally {
    fs.unlinkSync(audioFilePath); // Eliminar archivo temporal
  }
});

// Exportar la app como función de Firebase
exports.app = functions.https.onRequest(app);
