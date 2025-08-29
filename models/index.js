const sequelize = require("../config/database");
const Role = require("./Role");
const User = require("./User");

const models = {
  Role,
  User,
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
