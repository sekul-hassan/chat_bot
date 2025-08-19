const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./Users");

const QuestionAnswer = sequelize.define("QuestionAnswer", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = QuestionAnswer;
