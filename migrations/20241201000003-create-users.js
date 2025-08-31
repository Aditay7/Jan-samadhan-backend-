"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      otp: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      otp_expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_phone_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_profile_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      login_method: {
        type: Sequelize.ENUM("password", "otp", "both"),
        allowNull: false,
        defaultValue: "both",
      },
      supervisor_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("users");
  },
};
