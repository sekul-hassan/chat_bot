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

        const docsWithUrl = documents.map(doc => {
            const fileName = path.basename(doc.filePath); // just the file name
            return {
                id: doc.id,
                title: doc.title,
                content: doc.content,
                fileName,
                viewUrl: `/uploads/${fileName}` // static URL
            };
        });

        res.json(docsWithUrl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete document
exports.deleteDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const document = await Document.findOne({ where: { userId } });

        if (!document) return res.status(404).json({ error: "Document not found" });

        // Delete file from disk
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        await document.destroy();

        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update document (replace file + update title/content)
exports.updateDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;

        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const document = await Document.findOne({ where: { userId } });
        if (!document) return res.status(404).json({ error: "Document not found" });

        // Delete previous file
        if (fs.existsSync(document.filePath)) fs.unlinkSync(document.filePath);

        // Update document
        document.title = title || document.title;
        document.content = content || document.content;
        document.filePath = req.file.path;
        await document.save();

        res.json({ message: "Document updated successfully", document, fileName: req.file.filename });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};