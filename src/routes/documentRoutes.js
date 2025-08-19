const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const {
    uploadDocument,
    getDocuments,
    updateDocument,
    deleteDocument
} = require("../controllers/documentController");

// Upload new document or replace existing
router.post("/upload", authMiddleware, upload.single("document"), uploadDocument);

// Get all user's documents
router.get("/", authMiddleware, getDocuments);

// Update document (replace file)
router.put("/update", authMiddleware, upload.single("document"), updateDocument);

// Delete document
router.delete("/delete", authMiddleware, deleteDocument);

module.exports = router;
