const { Document } = require("../models");

exports.uploadDocument = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        const document = await Document.create({ title, content, filePath: "dummy/path", userId });
        res.status(201).json({ message: "Document uploaded", document });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const documents = await Document.findAll({ where: { userId } });
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
