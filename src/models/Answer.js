const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Answer = sequelize.define("Answer", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Answer;
