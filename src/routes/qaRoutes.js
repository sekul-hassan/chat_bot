const express = require("express")
const authMiddleware = require("../middleware/authMiddleware");
const {askQuestion, qaList, analytics} = require("../controllers/qaController");

const qaRoutes = express.Router()

qaRoutes.post("/ask",authMiddleware,askQuestion)
qaRoutes.get("/list",authMiddleware,qaList)
qaRoutes.get("/analytics",authMiddleware,analytics)


module.exports = qaRoutes;