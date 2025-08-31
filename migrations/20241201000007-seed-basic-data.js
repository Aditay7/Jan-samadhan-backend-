"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert basic roles
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          role_name: "Citizen",
          description: "Regular citizen who can report issues",
          permissions: JSON.stringify({
            issues: ["create", "read_own", "update_own"],
            profile: ["read", "update"],
          }),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_name: "Supervisor",
          description: "Field supervisor who handles issues",
          permissions: JSON.stringify({
            issues: ["read", "update", "assign"],
            profile: ["read", "update"],
            reports: ["read"],
          }),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_name: "Department Officer",
          description: "Department staff who manages issues",
          permissions: JSON.stringify({
            issues: ["read", "update", "assign", "resolve"],
            users: ["read", "create"],
            reports: ["read", "create"],
            departments: ["read", "update"],
          }),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_name: "Admin",
          description: "System administrator with full access",
          permissions: JSON.stringify({
            issues: ["read", "create", "update", "delete"],
            users: ["read", "create", "update", "delete"],
            departments: ["read", "create", "update", "delete"],
            categories: ["read", "create", "update", "delete"],
            roles: ["read", "create", "update", "delete"],
            reports: ["read", "create", "update", "delete"],
            system: ["configure"],
          }),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // Insert basic departments
    await queryInterface.bulkInsert(
      "departments",
      [
        {
          name: "Water Supply",
          description: "Handles water supply related issues",
          code: "WS",
          contact_email: "water@jalsamadhan.gov.in",
          contact_phone: "+91-1234567890",
          address: "Water Supply Department, Jal Samadhan",
          sla_hours: 48,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Sewerage",
          description: "Handles sewerage and drainage issues",
          code: "SW",
          contact_email: "sewerage@jalsamadhan.gov.in",
          contact_phone: "+91-1234567891",
          address: "Sewerage Department, Jal Samadhan",
          sla_hours: 72,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Road Maintenance",
          description: "Handles road and infrastructure issues",
          code: "RM",
          contact_email: "roads@jalsamadhan.gov.in",
          contact_phone: "+91-1234567892",
          address: "Road Maintenance Department, Jal Samadhan",
          sla_hours: 96,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    // Insert basic categories
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "Water Leakage",
          code: "WL",
          description: "Water pipeline leakage or burst",
          icon: "💧",
          color: "#007bff",
          priority: "high",
          sla_hours: 24,
          default_department_id: 1,
          requires_photo: true,
          requires_location: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Sewer Blockage",
          code: "SB",
          description: "Sewer line blockage or overflow",
          icon: "🚽",
          color: "#dc3545",
          priority: "high",
          sla_hours: 48,
          default_department_id: 2,
          requires_photo: true,
          requires_location: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Road Damage",
          code: "RD",
          description: "Potholes, road damage, or construction issues",
          icon: "🛣️",
          color: "#ffc107",
          priority: "medium",
          sla_hours: 72,
          default_department_id: 3,
          requires_photo: true,
          requires_location: true,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove seeded data in reverse order
    await queryInterface.bulkDelete("categories", null, {});
    await queryInterface.bulkDelete("departments", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
