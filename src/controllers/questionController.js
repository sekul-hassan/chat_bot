const { Question, Answer } = require("../models");

exports.askQuestion = async (req, res) => {
    try {
        const { documentId, text } = req.body;
        const userId = req.user.id;

        const question = await Question.create({ text, documentId, userId });

        // Dummy AI response (later connect HuggingFace/OpenAI)
        const answerText = `Answer generated for: ${text}`;
        const answer = await Answer.create({ text: answerText, questionId: question.id });

        res.status(201).json({ question, answer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAnswers = async (req, res) => {
    try {
        const { questionId } = req.params;
        const answer = await Answer.findOne({ where: { questionId } });
        res.json(answer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
