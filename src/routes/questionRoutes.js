const express = require("express");
const router = express.Router();
const { askQuestion, getAnswers } = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/ask", authMiddleware, askQuestion);
router.get("/:questionId", authMiddleware, getAnswers);

module.exports = router;
