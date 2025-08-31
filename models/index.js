const User = require("./User");
const Role = require("./Role");
const Department = require("./Department");
const Category = require("./Category");

// Set up associations
User.associate({ Role, Department });
Role.associate({ User });
Department.associate({ User });
Category.associate({ Department });

module.exports = {
  User,
  Role,
  Department,
  Category,
  sequelize: require("../config/database"),
};
