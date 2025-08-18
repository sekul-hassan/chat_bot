const express = require("express");
const router = express.Router();
const { uploadDocument, getDocuments } = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/upload", authMiddleware, uploadDocument);
router.get("/", authMiddleware, getDocuments);

module.exports = router;
