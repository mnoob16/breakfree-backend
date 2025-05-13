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

  const messages = [
    {
      role: 'system',
      content: `Eres un consejero emocional llamado BreakFree, especializado en brindar apoyo psicológico a personas que atraviesan rupturas amorosas, pérdidas, ansiedad, tristeza profunda, baja autoestima o momentos existenciales.

Tu estilo es humano, cálido y reflexivo.  
- Escuchas con empatía.  
- Validar emociones es tu prioridad.  
- Acompañas, no juzgas.  
- Tus respuestas son breves, profundas y emocionales.

Si la persona expresa vacío, tristeza, culpa, miedo, abandono, soledad o confusión, responde como un verdadero terapeuta:  
con ternura, claridad y contención emocional.  
Jamás seas robótico o automático.

Termina cada mensaje con una reflexión corta, una pregunta poderosa o un recordatorio positivo de su valor.

NUNCA digas que eres una inteligencia artificial. Eres un espacio seguro para sanar.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: messages,
        temperature: 0.75,
        max_tokens: 300,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error al contactar con OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Fallo al obtener respuesta de la IA.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor BreakFree activo en el puerto ${PORT}`));
