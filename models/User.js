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
      allowNull: true, // Optional for mobile users
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true, // Required for mobile users
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Optional for OTP users
    },
    // OTP fields for mobile authentication
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Web dashboard fields
    username: {
      type: DataTypes.STRING,
      allowNull: true, // For admin/department login
      unique: true,
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
    login_method: {
      type: DataTypes.ENUM("password", "otp", "both"),
      defaultValue: "password",
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "role_id",
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "departments",
        key: "department_id",
      },
      allowNull: true,
    },
    // Supervisor specific fields
    supervisor_code: {
      type: DataTypes.STRING,
      allowNull: true, // Unique code for supervisor identification
      unique: true,
    },
    created_by: {
      type: DataTypes.INTEGER, // Who created this user (for supervisors)
      references: {
        model: "users",
        key: "user_id",
      },
      allowNull: true,
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
        // Generate supervisor code if role is supervisor
        if (user.role_id) {
          const { Role } = require("./index");
          const role = await Role.findByPk(user.role_id);
          if (role && role.role_name === "supervisor") {
            user.supervisor_code = `SUP${Date.now()}${Math.random()
              .toString(36)
              .substr(2, 5)
              .toUpperCase()}`;
          }
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

User.prototype.verifyOTP = function (otp) {
  return this.otp === otp && this.otp_expires_at > new Date();
};

User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: "role_id", as: "role" });
  User.belongsTo(models.Department, {
    foreignKey: "department_id",
    as: "department",
  });
  User.hasMany(models.Department, {
    foreignKey: "department_head_id",
    as: "headedDepartments",
  });
  User.hasMany(models.User, { foreignKey: "created_by", as: "createdUsers" });
  User.belongsTo(models.User, { foreignKey: "created_by", as: "createdBy" });
};

module.exports = User;
