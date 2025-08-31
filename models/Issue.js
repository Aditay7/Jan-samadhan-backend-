const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Issue extends Model {}

Issue.init(
  {
    issue_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "submitted",
        "acknowledged",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "reopened"
      ),
      defaultValue: "submitted",
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326), // PostGIS point for GPS coordinates
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photos: {
      type: DataTypes.JSON, // Array of photo URLs
      defaultValue: [],
      allowNull: false,
    },
    voice_note: {
      type: DataTypes.STRING, // URL to voice note file
      allowNull: true,
    },
    // Auto-routing fields
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "category_id",
      },
      allowNull: false,
    },
    assigned_department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "departments",
        key: "department_id",
      },
      allowNull: true,
    },
    assigned_supervisor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
      allowNull: true,
    },
    // SLA and timing
    sla_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sla_breached: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Progress tracking
    progress_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    // Citizen feedback
    citizen_rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
      allowNull: true,
    },
    citizen_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // AI/ML fields (for future enhancement)
    ai_category_confidence: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
        max: 1,
      },
      allowNull: true,
    },
    ai_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Metadata
    reported_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
      allowNull: false,
    },
    is_anonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tags: {
      type: DataTypes.JSON, // Array of tags for filtering
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Issue",
    tableName: "issues",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["status"],
      },
      {
        fields: ["priority"],
      },
      {
        fields: ["category_id"],
      },
      {
        fields: ["assigned_department_id"],
      },
      {
        fields: ["reported_by"],
      },
      {
        fields: ["location"],
        using: "GIST", // Spatial index for location queries
      },
    ],
  }
);

Issue.associate = (models) => {
  Issue.belongsTo(models.User, { foreignKey: "reported_by", as: "reporter" });
  Issue.belongsTo(models.Category, {
    foreignKey: "category_id",
    as: "category",
  });
  Issue.belongsTo(models.Department, {
    foreignKey: "assigned_department_id",
    as: "assignedDepartment",
  });
  Issue.belongsTo(models.User, {
    foreignKey: "assigned_supervisor_id",
    as: "assignedSupervisor",
  });
};

module.exports = Issue;
