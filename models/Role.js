const { DataTypes } = require("sequelize");

const Role = (sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "role_id",
      as: "users",
    });
  };

  return Role;
};

module.exports = Role;
