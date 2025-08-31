const { Department } = require("../models");

const departments = [
  {
    name: "Public Works Department",
    code: "PWD",
    description: "Responsible for roads, bridges, and public infrastructure",
    contact_email: "pwd@municipality.gov",
    contact_phone: "+91-1234567890",
    address: "Municipal Building, City Center",
    sla_hours: 48,
  },
  {
    name: "Sanitation Department",
    code: "SAN",
    description: "Responsible for waste management and cleanliness",
    contact_email: "sanitation@municipality.gov",
    contact_phone: "+91-1234567891",
    address: "Sanitation Complex, Industrial Area",
    sla_hours: 24,
  },
  {
    name: "Water Supply Department",
    code: "WSD",
    description: "Responsible for water supply and distribution",
    contact_email: "water@municipality.gov",
    contact_phone: "+91-1234567892",
    address: "Water Treatment Plant, River Road",
    sla_hours: 12,
  },
  {
    name: "Street Lighting Department",
    code: "SLD",
    description: "Responsible for street lights and electrical infrastructure",
    contact_email: "lighting@municipality.gov",
    contact_phone: "+91-1234567893",
    address: "Electrical Complex, Power Station Road",
    sla_hours: 36,
  },
  {
    name: "Parks and Gardens Department",
    code: "PGD",
    description: "Responsible for parks, gardens, and green spaces",
    contact_email: "parks@municipality.gov",
    contact_phone: "+91-1234567894",
    address: "Botanical Garden, Green Zone",
    sla_hours: 72,
  },
];

async function seedDepartments() {
  try {
    console.log("Starting department seeding...");

    for (const deptData of departments) {
      const [department, created] = await Department.findOrCreate({
        where: { code: deptData.code },
        defaults: deptData,
      });

      if (created) {
        console.log(
          `✅ Created department: ${deptData.name} (${deptData.code})`
        );
      } else {
        console.log(
          `⏭️  Department already exists: ${deptData.name} (${deptData.code})`
        );
      }
    }

    console.log("✅ Department seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding departments:", error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDepartments();
}

module.exports = seedDepartments;
