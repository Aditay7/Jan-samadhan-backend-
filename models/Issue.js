const { DataTypes } = require("sequelize");

const Issue = (sequelize) => {
  const Issue = sequelize.define(
    "Issue",
    {
      issue_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "reported",
          "acknowledged",
          "assigned",
          "in_progress",
          "resolved",
          "closed",
          "rejected"
        ),
        allowNull: false,
        defaultValue: "reported",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
        defaultValue: "medium",
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
      // location: {
      //   type: DataTypes.GEOMETRY('POINT', 4326),
      //   allowNull: true,
      // },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      photos: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      voice_note: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      assigned_supervisor_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reported_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sla_deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      progress_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
      citizen_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      resolution_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      tableName: "issues",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Issue.associate = (models) => {
    Issue.belongsTo(models.User, {
      foreignKey: "reported_by",
      as: "reporter",
    });
    Issue.belongsTo(models.User, {
      foreignKey: "assigned_supervisor_id",
      as: "supervisor",
    });
    Issue.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
    Issue.belongsTo(models.Department, {
      foreignKey: "assigned_department_id",
      as: "department",
    });
  };

  return Issue;
};

module.exports = Issue;
