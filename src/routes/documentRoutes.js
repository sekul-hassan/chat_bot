const express = require("express");
const router = express.Router();
const { uploadDocument, getDocuments } = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", authMiddleware, upload.single("document"), uploadDocument);
router.get("/", authMiddleware, getDocuments);


module.exports = router;
