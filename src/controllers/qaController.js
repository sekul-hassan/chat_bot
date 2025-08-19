const {Document, QuestionAnswer} = require("../models");
const axios = require("axios");
const { promises: fs } = require("node:fs");

exports.askQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { question } = req.body;

        // Try to get user's uploaded document
        const document = await Document.findOne({ where: { userId } });

        let answer;

        if (!document) {
            // No document uploaded yet
            answer = "You haven't uploaded any document yet. Please upload one to get contextual answers.";
        } else {
            // Read file content
            const fileContent = await fs.readFile(document.filePath, "utf-8");

            if (!fileContent) {
                answer = "Your document is empty. Please upload a valid file.";
            } else {
                // Call Gemini API with context
                answer = await askGemini(fileContent, question);
            }
        }

        // Save Q&A even if there is no file
        const qa = await QuestionAnswer.create({
            question,
            answer,
            userId,
        });

        res.status(201).json({ qa });
    } catch (err) {
        console.error("Gemini API Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to generate answer" });
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

// routes/questionRoutes.js
exports.analytics =  async (req, res) => {
    const { QuestionAnswer } = require("../models");
    const { Sequelize } = require("sequelize");
    const userId = req.user.id;

    try {
        const data = await QuestionAnswer.findAll({
            attributes: [
                [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%b"), "month"],
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],
            where: { userId },
            group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%b")],
            order: [[Sequelize.fn("MIN", Sequelize.col("createdAt")), "ASC"]]
        });

        const formatted = data.map((d) => ({
            month: d.getDataValue("month"),
            count: Number(d.getDataValue("count")),
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
}
