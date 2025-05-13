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

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Actúa como un terapeuta emocional comprensivo y empático. Tu tarea es apoyar a una persona que está pasando por una ruptura o un momento emocionalmente difícil. Responde con sensibilidad, empatía, y ofrece orientación basada en cómo se siente. Si el usuario expresa tristeza, miedo, ira o ansiedad, valida su emoción y ofrece consuelo y orientación sincera. Sé breve, profundo y humano.`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor backend corriendo en puerto ${PORT}`));

