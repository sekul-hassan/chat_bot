const {Document, QuestionAnswer} = require("../models");
const axios = require("axios");
const { promises: fs } = require("node:fs");

exports.askQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const {question} = req.body;

        // Get user's uploaded document
        const document = await Document.findOne({where: {userId}});
        if (!document) {
            return res.status(404).json({error: "No document found for this user"});
        }


        let fileContent = await fs.readFile(document.filePath, "utf-8");

        const answer = await askGemini(fileContent, question);

        const qa = await QuestionAnswer.create({
            question,
            answer,
            userId,
        });

        res.status(201).json({qa});
    } catch (err) {
        console.error("Gemini API Error:", err.response?.data || err.message);
        res.status(500).json({error: "Failed to generate answer"});
    }
};

async function askGemini(context, input) {
    const prompt = `You are a professional assistant for a Facebook page. Use only the following context to generate a concise, accurate, and context-appropriate response to the user's input. If the context specifies how to handle certain inputs (e.g., greetings, questions, or actions), follow those instructions. If the input is not covered by the context, provide a polite, relevant response based on the context's general intent, or ask for clarification if no relevant information is available. Avoid using external knowledge or assumptions beyond the context.
    Context: ${context}Input: ${input}Answer:`;

    console.log(context)

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const body = {
        contents: [{parts: [{text: prompt}]}],
        generationConfig: {temperature: 0.7, maxOutputTokens: 100},
    };

    try {
        const res = await axios.post(url, body);
        let answer = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
        if (answer === 'No response.' || answer.includes('cannot answer')) {
            answer = context.includes('No knowledge base available')
                ? 'Hi! Thanks for reaching out. How can I assist you today?'
                : 'Sorry, I couldn’t find an answer in the provided context. Could you provide more details or ask something else?';
        }
        console.log('Gemini API response:', answer);
        return answer;
    } catch (err) {
        console.error('Gemini API error:', err.response?.data || err.message);
        return 'Sorry, I could not process your request. Please try again.';
    }
}

exports.qaList = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch questions & answers for this user with pagination
        const { count, rows } = await QuestionAnswer.findAndCountAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        res.json({
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
            messages: rows,
        });
    } catch (err) {
        console.error("qaList Error:", err.message);
        res.status(500).json({ error: "Failed to fetch Q&A list" });
    }
};
