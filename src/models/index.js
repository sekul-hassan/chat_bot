const sequelize = require("../config/database");
const User = require("./Users");
const Document = require("./Document");
const QuestionAnswer = require("./QuestionAnswer");


const applyAssociations = () => {
    // User ↔ Document
    User.hasMany(Document, { foreignKey: "userId", onDelete: "CASCADE" });
    Document.belongsTo(User, { foreignKey: "userId" });

    // Associations
    User.hasMany(QuestionAnswer, { foreignKey: "userId", onDelete: "CASCADE" });
    QuestionAnswer.belongsTo(User, { foreignKey: "userId" });

};

// Apply associations before exporting
applyAssociations();

module.exports = {
    sequelize,
    User,
    Document,
    QuestionAnswer
};
