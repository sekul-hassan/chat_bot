const { Document } = require("../models");
const fs = require("fs");
const path = require("path");

exports.uploadDocument = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Check if user already has a document
        let document = await Document.findOne({ where: { userId } });

        if (document) {
            // ✅ Delete previous file from uploads folder
            if (fs.existsSync(document.filePath)) {
                fs.unlinkSync(document.filePath);
            }

            // Update existing document
            document.title = title;
            document.content = content;
            document.filePath = req.file.path;
            await document.save();

            return res.status(200).json({
                message: "Document replaced successfully",
                document,
                fileName: req.file.filename,
            });
        }

        // If no document exists, create new
        document = await Document.create({
            title,
            content,
            filePath: req.file.path,
            userId,
        });

        res.status(201).json({
            message: "Document uploaded successfully",
            document,
            fileName: req.file.filename,
        });
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
