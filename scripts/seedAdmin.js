const { User, Role } = require("../models");

async function seedAdmin() {
  try {
    console.log("Starting admin seeding...");

    // Get admin role
    const adminRole = await Role.findOne({ where: { role_name: "admin" } });
    if (!adminRole) {
      console.error("❌ Admin role not found. Please run seed:roles first.");
      return;
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { username: "admin" },
    });

    if (existingAdmin) {
      console.log("⏭️  Admin user already exists");
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: "System Administrator",
      username: "admin",
      email: "admin@jalsamadhan.gov",
      password: "admin123", // Change this in production!
      role_id: adminRole.role_id,
      login_method: "password",
      is_verified: true,
      is_active: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📋 Admin credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
