const { Role } = require("../models");

const roles = [
  {
    role_name: "citizen",
    description: "Regular citizen who can report issues",
    permissions: {
      issue: ["create", "read_own", "update_own"],
      profile: ["read_own", "update_own"],
      notification: ["read_own"],
    },
  },
  {
    role_name: "supervisor",
    description: "Supervisor/Contractor who manages field workers",
    permissions: {
      issue: ["read_assigned", "update_assigned", "update_progress"],
      worker: ["manage_own_team"],
      profile: ["read_own", "update_own"],
      notification: ["read_own", "send_team"],
    },
  },
  {
    role_name: "department_officer",
    description: "Department Officer who manages supervisors and contractors",
    permissions: {
      issue: ["read_department", "assign", "reassign", "close"],
      supervisor: ["register", "manage", "view_performance"],
      contractor: ["register", "manage", "view_performance"],
      department: ["read_own", "update_own"],
      analytics: ["read_department"],
      profile: ["read_own", "update_own"],
      notification: ["read_own", "send_department"],
    },
  },
  {
    role_name: "admin",
    description: "System administrator with full access",
    permissions: {
      issue: ["read_all", "create", "update", "delete", "assign", "reassign"],
      user: ["create", "read_all", "update", "delete"],
      role: ["create", "read_all", "update", "delete"],
      department: ["create", "read_all", "update", "delete"],
      category: ["create", "read_all", "update", "delete"],
      analytics: ["read_all", "export"],
      system: ["configure", "maintain"],
      profile: ["read_own", "update_own"],
      notification: ["read_all", "send_all"],
    },
  },
];

async function seedRoles() {
  try {
    console.log("Starting role seeding...");

    for (const roleData of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { role_name: roleData.role_name },
        defaults: roleData,
      });

      if (created) {
        console.log(`✅ Created role: ${roleData.role_name}`);
      } else {
        console.log(`⏭️  Role already exists: ${roleData.role_name}`);
      }
    }

    console.log("✅ Role seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding roles:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedRoles();
}

module.exports = seedRoles;
