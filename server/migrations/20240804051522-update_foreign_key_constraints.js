"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("comments", "comments_ibfk_1");
    await queryInterface.addConstraint("comments", {
      fields: ["userId"],
      type: "foreign key",
      name: "comments_ibfk_1",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("comments", "comments_ibfk_1");
    await queryInterface.addConstraint("comments", {
      fields: ["userId"],
      type: "foreign key",
      name: "comments_ibfk_1",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
  },
};
