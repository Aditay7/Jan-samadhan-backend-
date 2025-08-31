const { DataTypes } = require("sequelize");

const Category = (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(7), // Hex color code
        allowNull: true,
        defaultValue: "#007bff",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
        defaultValue: "medium",
      },
      sla_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 72,
      },
      default_department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      requires_photo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      requires_location: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Category.associate = (models) => {
    Category.belongsTo(models.Department, {
      foreignKey: "default_department_id",
      as: "defaultDepartment",
    });
    Category.hasMany(models.Issue, {
      foreignKey: "category_id",
      as: "issues",
    });
  };

  return Category;
};

module.exports = Category;
