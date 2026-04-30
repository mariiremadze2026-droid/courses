const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { sequelize, User, Book } = require('./models');

const app = express();
const openai = new OpenAI({ apiKey: 'YOUR_OPENAI_KEY' });

app.use(cors());
app.use(express.json());

// წიგნების წამოღება
app.get('/api/books', async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
});

// AI ჩატი
app.post('/api/ai/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "system", content: "შენ ხარ ქართველი სასწავლო ასისტენტი." }, { role: "user", content: message }],
        });
        res.json({ answer: completion.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ answer: "AI ხაზზე ვერ გამოდის..." });
    }
});

sequelize.sync().then(() => app.listen(5000, () => console.log("Server running on 5000")));
