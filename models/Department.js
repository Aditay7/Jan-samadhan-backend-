const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Department extends Model {}

Department.init(
  {
    department_id: {
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
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    geofence: {
      type: DataTypes.GEOMETRY("POLYGON", 4326), // PostGIS polygon for department boundaries
      allowNull: true,
    },
    sla_hours: {
      type: DataTypes.INTEGER,
      defaultValue: 72, // Default 72 hours SLA
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    department_head_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Department",
    tableName: "departments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Department.associate = (models) => {
  Department.belongsTo(models.User, {
    foreignKey: "department_head_id",
    as: "departmentHead",
  });
  Department.hasMany(models.User, {
    foreignKey: "department_id",
    as: "employees",
  });
};

module.exports = Department;
