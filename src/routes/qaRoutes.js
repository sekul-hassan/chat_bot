const express = require("express")
const authMiddleware = require("../middleware/authMiddleware");
const {askQuestion} = require("../controllers/qaController");

const qaRoutes = express.Router()

qaRoutes.post("/ask",authMiddleware,askQuestion)

module.exports = qaRoutes;