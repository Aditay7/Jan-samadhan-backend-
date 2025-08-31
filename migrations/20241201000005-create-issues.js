"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("issues", {
      issue_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "reported",
          "acknowledged",
          "assigned",
          "in_progress",
          "resolved",
          "closed",
          "rejected"
        ),
        allowNull: false,
        defaultValue: "reported",
      },
      priority: {
        type: Sequelize.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
        defaultValue: "medium",
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      photos: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      voice_note: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      assigned_department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      assigned_supervisor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reported_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sla_deadline: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      progress_percentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      citizen_feedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      resolution_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable("issues");
  },
};
