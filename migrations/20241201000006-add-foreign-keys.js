"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key for users.role_id -> roles.role_id
    await queryInterface.addConstraint("users", {
      fields: ["role_id"],
      type: "foreign key",
      name: "fk_users_role_id",
      references: {
        table: "roles",
        field: "role_id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });

    // Add foreign key for users.department_id -> departments.department_id
    await queryInterface.addConstraint("users", {
      fields: ["department_id"],
      type: "foreign key",
      name: "fk_users_department_id",
      references: {
        table: "departments",
        field: "department_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key for users.created_by -> users.user_id (self-referential)
    await queryInterface.addConstraint("users", {
      fields: ["created_by"],
      type: "foreign key",
      name: "fk_users_created_by",
      references: {
        table: "users",
        field: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key for departments.department_head_id -> users.user_id
    await queryInterface.addConstraint("departments", {
      fields: ["department_head_id"],
      type: "foreign key",
      name: "fk_departments_department_head_id",
      references: {
        table: "users",
        field: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key for categories.default_department_id -> departments.department_id
    await queryInterface.addConstraint("categories", {
      fields: ["default_department_id"],
      type: "foreign key",
      name: "fk_categories_default_department_id",
      references: {
        table: "departments",
        field: "department_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key for issues.category_id -> categories.category_id
    await queryInterface.addConstraint("issues", {
      fields: ["category_id"],
      type: "foreign key",
      name: "fk_issues_category_id",
      references: {
        table: "categories",
        field: "category_id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });

    // Add foreign key for issues.assigned_department_id -> departments.department_id
    await queryInterface.addConstraint("issues", {
      fields: ["assigned_department_id"],
      type: "foreign key",
      name: "fk_issues_assigned_department_id",
      references: {
        table: "departments",
        field: "department_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key for issues.assigned_supervisor_id -> users.user_id
    await queryInterface.addConstraint("issues", {
      fields: ["assigned_supervisor_id"],
      type: "foreign key",
      name: "fk_issues_assigned_supervisor_id",
      references: {
        table: "users",
        field: "user_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // Add foreign key for issues.reported_by -> users.user_id
    await queryInterface.addConstraint("issues", {
      fields: ["reported_by"],
      type: "foreign key",
      name: "fk_issues_reported_by",
      references: {
        table: "users",
        field: "user_id",
      },
      onDelete: "NO ACTION",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign keys in reverse order
    await queryInterface.removeConstraint("issues", "fk_issues_reported_by");
    await queryInterface.removeConstraint(
      "issues",
      "fk_issues_assigned_supervisor_id"
    );
    await queryInterface.removeConstraint(
      "issues",
      "fk_issues_assigned_department_id"
    );
    await queryInterface.removeConstraint("issues", "fk_issues_category_id");
    await queryInterface.removeConstraint(
      "categories",
      "fk_categories_default_department_id"
    );
    await queryInterface.removeConstraint(
      "departments",
      "fk_departments_department_head_id"
    );
    await queryInterface.removeConstraint("users", "fk_users_created_by");
    await queryInterface.removeConstraint("users", "fk_users_department_id");
    await queryInterface.removeConstraint("users", "fk_users_role_id");
  },
};
