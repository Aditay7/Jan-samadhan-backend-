"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING(7),
        allowNull: true,
        defaultValue: "#007bff",
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
        defaultValue: "medium",
      },
      sla_hours: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 72,
      },
      default_department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      requires_photo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      requires_location: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("categories");
  },
};
