const express = require("express")
const authMiddleware = require("../middleware/authMiddleware");
const {askQuestion, qaList} = require("../controllers/qaController");

const qaRoutes = express.Router()

qaRoutes.post("/ask",authMiddleware,askQuestion)
qaRoutes.get("/list",authMiddleware,qaList)


module.exports = qaRoutes;