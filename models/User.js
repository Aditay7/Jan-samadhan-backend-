const { DataTypes } = require("sequelize");

const User = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Location fields for mobile users
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // OTP fields for mobile authentication
      otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_phone_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // Profile completion status
      is_profile_complete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // Login method preference
      login_method: {
        type: DataTypes.ENUM("password", "otp", "both"),
        allowNull: false,
        defaultValue: "both",
      },
      // Supervisor-specific fields
      supervisor_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
      },
      // Track who created this user (for supervisors created by department officers)
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const { hash } = require("argon2");
            user.password = await hash(user.password);
          }
          if (user.role_id === 3) {
            // Generate supervisor code for supervisors
            user.supervisor_code = Math.random()
              .toString(36)
              .substr(2, 8)
              .toUpperCase();
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const { hash } = require("argon2");
            user.password = await hash(user.password);
          }
        },
      },
    }
  );

  // Instance methods
  User.prototype.verifyPassword = async function (password) {
    const { verify } = require("argon2");
    return await verify(this.password, password);
  };

  User.prototype.verifyOTP = function (otp) {
    if (!this.otp || !this.otp_expires_at) {
      return false;
    }
    if (new Date() > this.otp_expires_at) {
      return false;
    }
    return this.otp === otp;
  };

  // Associations
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
    // Self-referential associations for user hierarchy
    User.hasMany(User, { foreignKey: "created_by", as: "createdUsers" });
    User.belongsTo(User, { foreignKey: "created_by", as: "createdBy" });
  };

  return User;
};

module.exports = User;
