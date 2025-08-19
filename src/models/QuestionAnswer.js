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
        allowNull: true, // initially null, AI fills later
    },
});

// Associations
User.hasMany(QuestionAnswer, { foreignKey: "userId", onDelete: "CASCADE" });
QuestionAnswer.belongsTo(User, { foreignKey: "userId" });

module.exports = QuestionAnswer;
