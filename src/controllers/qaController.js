const { Document, QuestionAnswer } = require("../models");
const axios = require("axios");

exports.askQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { question } = req.body;

        // Get user's uploaded document
        const document = await Document.findOne({ where: { userId } });
        if (!document) {
            return res.status(404).json({ error: "No document found for this user" });
        }

        // Call Gemini API with user document + question
        const geminiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: `Document: ${document.content}` },
                            { text: `Question: ${question}` }
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
                },
            }
        );

        // Extract answer text safely
        const answer =
            geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No answer generated";

        // Save Q/A in DB
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
