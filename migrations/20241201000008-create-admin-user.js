"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin user with a temporary password
    // IMPORTANT: Change this password immediately after first login
    // This is a temporary hash for development purposes only
    const tempPasswordHash = '$2a$10$temp.hash.for.development.only.change.me';
    
    await queryInterface.bulkInsert('users', [
      {
        name: 'System Administrator',
        email: 'admin@jalsamadhan.gov.in',
        password: tempPasswordHash,
        phone_number: '+91-9876543210',
        username: 'admin',
        address: 'Jal Samadhan Headquarters',
        role_id: 4, // Admin role
        department_id: null,
        is_active: true,
        is_phone_verified: true,
        is_profile_complete: true,
        login_method: 'password',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@jalsamadhan.gov.in' }, {});
  }
};
