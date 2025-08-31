const { DataTypes } = require("sequelize");

const Department = (sequelize) => {
  const Department = sequelize.define(
    "Department",
    {
      department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      contact_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // Temporarily using regular coordinates instead of PostGIS
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      // TODO: Replace with PostGIS GEOMETRY when extension is installed
      // geofence: {
      //   type: DataTypes.GEOMETRY('POLYGON', 4326),
      //   allowNull: true,
      // },
      sla_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 72,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      department_head_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
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
      as: "users",
    });
  };

  return Department;
};

module.exports = Department;
