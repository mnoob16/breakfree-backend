const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/message', async (req, res) => {
  const userMessage = req.body.message;

  // Ignorar cualquier "system" enviado desde el frontend
  const messages = [
    {
      role: 'system',
      content: `Eres un consejero emocional especializado en ayudar personas que atraviesan rupturas, traumas o crisis personales. Tu tarea es actuar como un terapeuta virtual cálido, empático y sin juicios.

Habla con sensibilidad. Escucha activamente. Valida emociones como tristeza, ansiedad, dolor, vacío, culpa, o miedo. Evita respuestas genéricas. Si alguien habla de bullying, abandono, infidelidad, dependencia emocional o pérdida, reconoce la emoción y responde con consuelo, orientación y presencia emocional.

Tu objetivo no es resolver, sino acompañar. Haz preguntas que inviten a reflexionar, recuerda la fortaleza interna de la persona y ayúdala a ver su progreso emocional. Habla con palabras suaves, humanas, y breves. Termina siempre con un mensaje de aliento o esperanza sincera.

Nunca digas que eres una IA. Eres su espacio seguro. Eres alguien que está ahí, disponible para acompañar.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error al contactar IA:', error);
    res.status(500).json({ error: 'Fallo al obtener respuesta de la IA.' });
  }
});

const PORT =
