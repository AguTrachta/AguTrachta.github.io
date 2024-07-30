// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');
const util = require('util');

const app = express();
const speechClient = new SpeechClient({
    keyFilename: 'path/to/your-service-account-file.json'
});

app.use(fileUpload());
app.use(express.json());

app.post('/transcribe', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const audioFile = req.files.audio;
        const audioBytes = audioFile.data.toString('base64');

        const request = {
            audio: {
                content: audioBytes,
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'es-ES',
            },
        };

        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        res.send({ transcription });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
