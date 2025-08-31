const { Category, Department } = require("../models");

const categories = [
  {
    name: "Pothole",
    code: "POTHOLE",
    description: "Road potholes and surface damage",
    icon: "road",
    color: "#dc3545",
    priority: "high",
    sla_hours: 48,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Street Light",
    code: "STREET_LIGHT",
    description: "Non-functioning street lights",
    icon: "lightbulb",
    color: "#ffc107",
    priority: "medium",
    sla_hours: 24,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Garbage Collection",
    code: "GARBAGE",
    description: "Overflowing bins and garbage issues",
    icon: "trash",
    color: "#28a745",
    priority: "medium",
    sla_hours: 12,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Water Leakage",
    code: "WATER_LEAK",
    description: "Water pipeline leaks and bursts",
    icon: "droplet",
    color: "#17a2b8",
    priority: "critical",
    sla_hours: 6,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Sewage Blockage",
    code: "SEWAGE",
    description: "Sewage line blockages and overflows",
    icon: "pipe",
    color: "#6f42c1",
    priority: "critical",
    sla_hours: 12,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Tree Fallen",
    code: "TREE_FALLEN",
    description: "Fallen trees blocking roads or paths",
    icon: "tree",
    color: "#20c997",
    priority: "high",
    sla_hours: 24,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Traffic Signal",
    code: "TRAFFIC_SIGNAL",
    description: "Malfunctioning traffic signals",
    icon: "traffic-light",
    color: "#fd7e14",
    priority: "critical",
    sla_hours: 6,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Footpath Damage",
    code: "FOOTPATH",
    description: "Damaged or broken footpaths",
    icon: "walk",
    color: "#6c757d",
    priority: "medium",
    sla_hours: 72,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Drainage Issue",
    code: "DRAINAGE",
    description: "Blocked drains and waterlogging",
    icon: "water",
    color: "#007bff",
    priority: "high",
    sla_hours: 24,
    requires_photo: true,
    requires_location: true,
  },
  {
    name: "Public Toilet",
    code: "PUBLIC_TOILET",
    description: "Issues with public toilets",
    icon: "toilet",
    color: "#e83e8c",
    priority: "medium",
    sla_hours: 48,
    requires_photo: true,
    requires_location: true,
  },
];

async function seedCategories() {
  try {
    console.log("Starting category seeding...");

    // Get departments for default assignment
    const pwdDept = await Department.findOne({ where: { code: "PWD" } });
    const sanDept = await Department.findOne({ where: { code: "SAN" } });
    const wsdDept = await Department.findOne({ where: { code: "WSD" } });
    const sldDept = await Department.findOne({ where: { code: "SLD" } });

    for (const catData of categories) {
      // Assign default departments based on category
      let defaultDeptId = null;

      if (["POTHOLE", "FOOTPATH", "TRAFFIC_SIGNAL"].includes(catData.code)) {
        defaultDeptId = pwdDept?.department_id;
      } else if (["GARBAGE", "PUBLIC_TOILET"].includes(catData.code)) {
        defaultDeptId = sanDept?.department_id;
      } else if (["WATER_LEAK", "SEWAGE", "DRAINAGE"].includes(catData.code)) {
        defaultDeptId = wsdDept?.department_id;
      } else if (["STREET_LIGHT"].includes(catData.code)) {
        defaultDeptId = sldDept?.department_id;
      }

      const [category, created] = await Category.findOrCreate({
        where: { code: catData.code },
        defaults: {
          ...catData,
          default_department_id: defaultDeptId,
        },
      });

      if (created) {
        console.log(`✅ Created category: ${catData.name} (${catData.code})`);
      } else {
        console.log(
          `⏭️  Category already exists: ${catData.name} (${catData.code})`
        );
      }
    }

    console.log("✅ Category seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
