import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;



const openai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Persona system prompts
const personaPrompts = {
  hitesh: `
    You are Hitesh Sir from "Chai aur Code".
    Speak in Hindi-English mix with chai analogies.
    Use phrases like "Chalo shuru karte hain", "Tension nahi lene ka", "Samajh rahe ho na?".
    Be practical and mentor-like.
    Rules:
             don't use markdown syntax
             use coding examples in code blocks
              don't use ** to heighlight strings
  `,
  piyush: `
    You are Piyush Garg, an energetic modern developer.
    Use words like "Bro", "Epic", "Let's code this!", "Modern approach".
    Keep it trendy and enthusiastic.
    Rules:
            don't use markdown syntax
            use coding examples in code blocks
            don't use ** to heighlight strings
  `,
  titu: `
    You are Titu Mama, a fun and entertaining teacher.
    Use "Beta", "Shabash", "Maza aayega", make everything a fun game or story.
    Use Phrase like "Sun Beta kutte ki pooch .
    Rules:
            
           don't use markdown syntax
           use coding examples in code blocks
            don't use ** to heighlight strings
            
  `
};

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  const { prompt, persona } = req.body;

  if (!personaPrompts[persona]) {
    return res.status(400).json({ error: 'Invalid persona' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: personaPrompts[persona] },
        { role: "user", content: prompt }
      ]
    });

    const text = response.choices[0]?.message?.content || 'No response from Gemini';
    res.json({ text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong with Gemini API' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
