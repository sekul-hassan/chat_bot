const sequelize = require("../config/database");
const User = require("./Users");
const Document = require("./Document");
const Question = require("./Question");
const Answer = require("./Answer");

const applyAssociations = () => {
    // User ↔ Document
    User.hasMany(Document, { foreignKey: "userId", onDelete: "CASCADE" });
    Document.belongsTo(User, { foreignKey: "userId" });

    // User ↔ Question
    User.hasMany(Question, { foreignKey: "userId", onDelete: "CASCADE" });
    Question.belongsTo(User, { foreignKey: "userId" });

    // Document ↔ Question
    Document.hasMany(Question, { foreignKey: "documentId", onDelete: "CASCADE" });
    Question.belongsTo(Document, { foreignKey: "documentId" });

    // Question ↔ Answer
    Question.hasOne(Answer, { foreignKey: "questionId", onDelete: "CASCADE" });
    Answer.belongsTo(Question, { foreignKey: "questionId" });
};

// Apply associations before exporting
applyAssociations();

module.exports = {
    sequelize,
    User,
    Document,
    Question,
    Answer,
};
