const { Model, DataTypes } = require("sequelize");
const argon2 = require("argon2");
const sequelize = require("../config/database");

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    profile_image_url: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_token: {
      type: DataTypes.STRING,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles", // Assuming a 'roles' table for foreign key relationship
        key: "role_id",
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await argon2.hash(user.password);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await argon2.hash(user.password);
        }
      },
    },
  }
);

User.prototype.verifyPassword = async function (password) {
  return await argon2.verify(this.password, password);
};


User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });
};

module.exports = User;
