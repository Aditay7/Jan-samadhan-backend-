const { Category, Department, User } = require("../models");
const { Op } = require("sequelize");

class AutoRoutingService {
  /**
   * Auto-route an issue based on category and location
   */
  static async routeIssue(issueData) {
    try {
      const { category_id, location, priority } = issueData;

      // Step 1: Get category and its default department
      const category = await Category.findByPk(category_id, {
        include: [{ model: Department, as: "defaultDepartment" }],
      });

      if (!category) {
        throw new Error("Category not found");
      }

      // Step 2: Determine target department
      let targetDepartment = category.defaultDepartment;

      // Step 3: Check if location falls within any department's geofence
      if (location && location.coordinates) {
        const geofenceDepartment = await this.findDepartmentByGeofence(
          location
        );
        if (geofenceDepartment) {
          targetDepartment = geofenceDepartment;
        }
      }

      // Step 4: Calculate SLA deadline
      const slaHours = targetDepartment?.sla_hours || category.sla_hours || 72;
      const slaDeadline = new Date();
      slaDeadline.setHours(slaDeadline.getHours() + slaHours);

      // Step 5: Calculate priority score
      const priorityScore = this.calculatePriorityScore(issueData, category);

      // Step 6: Find available supervisor (future enhancement)
      const assignedSupervisor = await this.findAvailableSupervisor(
        targetDepartment?.department_id
      );

      return {
        assigned_department_id: targetDepartment?.department_id,
        assigned_supervisor_id: assignedSupervisor?.user_id,
        sla_deadline: slaDeadline,
        priority: priorityScore.priority,
        priority_score: priorityScore.score,
        routing_confidence: priorityScore.confidence,
      };
    } catch (error) {
      console.error("Auto-routing error:", error);
      throw error;
    }
  }

  /**
   * Find department by geofence (PostGIS spatial query)
   */
  static async findDepartmentByGeofence(location) {
    try {
      const point = `POINT(${location.coordinates[0]} ${location.coordinates[1]})`;

      const department = await Department.findOne({
        where: {
          geofence: {
            [Op.not]: null,
          },
          is_active: true,
        },
        attributes: [
          "department_id",
          "name",
          "code",
          "sla_hours",
          sequelize.literal(
            `ST_Contains(geofence, ST_GeomFromText('${point}', 4326)) as within_geofence`
          ),
        ],
        having: sequelize.literal("within_geofence = true"),
      });

      return department;
    } catch (error) {
      console.error("Geofence query error:", error);
      return null;
    }
  }

  /**
   * Calculate priority score based on multiple factors
   */
  static calculatePriorityScore(issueData, category) {
    let score = 0;
    let confidence = 0.8; // Base confidence

    // Category priority weight (40%)
    const categoryPriorityWeights = {
      low: 0.2,
      medium: 0.4,
      high: 0.6,
      critical: 0.8,
    };
    score += categoryPriorityWeights[category.priority] * 40;

    // Time-based urgency (20%)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour <= 22) {
      score += 20; // Daytime issues get higher priority
    }

    // Location-based factors (20%)
    // Future: Check proximity to hospitals, schools, government buildings
    score += 10; // Base location score

    // Content-based factors (20%)
    if (issueData.description) {
      const urgentKeywords = [
        "emergency",
        "urgent",
        "dangerous",
        "blocking",
        "broken",
      ];
      const description = issueData.description.toLowerCase();
      const urgentCount = urgentKeywords.filter((keyword) =>
        description.includes(keyword)
      ).length;
      score += urgentCount * 4; // 4 points per urgent keyword
    }

    // Determine final priority
    let priority = "medium";
    if (score >= 70) priority = "critical";
    else if (score >= 50) priority = "high";
    else if (score >= 30) priority = "medium";
    else priority = "low";

    return {
      score: Math.min(score, 100),
      priority,
      confidence,
    };
  }

  /**
   * Find available supervisor for department
   */
  static async findAvailableSupervisor(departmentId) {
    if (!departmentId) return null;

    try {
      // Find supervisors in the department with lowest workload
      const supervisor = await User.findOne({
        where: {
          department_id: departmentId,
          role_id: {
            [Op.in]: await this.getSupervisorRoleIds(),
          },
          is_active: true,
        },
        include: [
          {
            model: require("../models").Role,
            as: "role",
            where: { role_name: "supervisor" },
          },
        ],
        order: [
          // Order by workload (number of assigned issues)
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM issues WHERE assigned_supervisor_id = User.user_id AND status IN ("assigned", "in_progress"))'
            ),
            "ASC",
          ],
        ],
      });

      return supervisor;
    } catch (error) {
      console.error("Supervisor assignment error:", error);
      return null;
    }
  }

  /**
   * Get supervisor role IDs
   */
  static async getSupervisorRoleIds() {
    const { Role } = require("../models");
    const supervisorRoles = await Role.findAll({
      where: { role_name: "supervisor" },
      attributes: ["role_id"],
    });
    return supervisorRoles.map((role) => role.role_id);
  }

  /**
   * Update SLA breach status for all issues
   */
  static async updateSLABreaches() {
    try {
      const now = new Date();

      // Find issues with breached SLA
      const breachedIssues = await require("../models").Issue.findAll({
        where: {
          sla_deadline: {
            [Op.lt]: now,
          },
          sla_breached: false,
          status: {
            [Op.in]: ["submitted", "acknowledged", "assigned", "in_progress"],
          },
        },
      });

      // Update breach status
      for (const issue of breachedIssues) {
        await issue.update({ sla_breached: true });

        // TODO: Send escalation notifications
        console.log(`SLA breached for issue ${issue.issue_id}`);
      }

      return breachedIssues.length;
    } catch (error) {
      console.error("SLA breach update error:", error);
      return 0;
    }
  }
}

module.exports = AutoRoutingService;
