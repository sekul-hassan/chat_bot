const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { sequelize } = require("./src/models");

const authRoutes = require("./src/routes/autoRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const qaRoutes = require("./src/routes/qaRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("🚀 Doc AI App Backend Running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/questions", qaRoutes);

// Sync Database
sequelize
    .sync({ alter: true })
    .then(() => console.log("✅ Database synced"))
    .catch((err) => console.error("❌ DB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
