"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin user with an Argon2-hashed password at migration time
    const { hash } = require("argon2");
    const tempPasswordHash = await hash(
      process.env.ADMIN_INITIAL_PASSWORD || "admin123"
    );

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "System Administrator",
          email: "admin@jalsamadhan.gov.in",
          password: tempPasswordHash,
          phone_number: "+91-9876543210",
          username: "admin",
          address: "Jal Samadhan Headquarters",
          role_id: 4, // Admin role (seeded as id 4)
          department_id: null,
          is_active: true,
          is_phone_verified: true,
          is_profile_complete: true,
          login_method: "password",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      { email: "admin@jalsamadhan.gov.in" },
      {}
    );
  },
};
