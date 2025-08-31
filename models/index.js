const sequelize = require("../config/database");

// Import model definitions
const User = require("./User");
const Role = require("./Role");
const Department = require("./Department");
const Category = require("./Category");
const Issue = require("./Issue");

// Initialize models with sequelize instance
const UserModel = User(sequelize);
const RoleModel = Role(sequelize);
const DepartmentModel = Department(sequelize);
const CategoryModel = Category(sequelize);
const IssueModel = Issue(sequelize);

// Set up associations
UserModel.associate({
  User: UserModel,
  Role: RoleModel,
  Department: DepartmentModel,
});
RoleModel.associate({ User: UserModel });
DepartmentModel.associate({ User: UserModel });
CategoryModel.associate({ Department: DepartmentModel, Issue: IssueModel });
IssueModel.associate({
  User: UserModel,
  Category: CategoryModel,
  Department: DepartmentModel,
});

module.exports = {
  User: UserModel,
  Role: RoleModel,
  Department: DepartmentModel,
  Category: CategoryModel,
  Issue: IssueModel,
  sequelize,
};
