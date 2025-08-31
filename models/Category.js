const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Category extends Model {}

Category.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: "#007bff",
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
      allowNull: false,
    },
    sla_hours: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can be overridden by department SLA
    },
    default_department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "departments",
        key: "department_id",
      },
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    requires_photo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    requires_location: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Category",
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
};

module.exports = Category;
