const { Category, Department, User, sequelize } = require("../models");
const { Op } = require("sequelize");

class AutoRoutingService {
  // Calculate distance between two points using Haversine formula
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Find the best department for an issue based on category and location
  static async findBestDepartment(categoryId, latitude, longitude) {
    try {
      // Get the category and its default department
      const category = await Category.findByPk(categoryId, {
        include: [{ model: Department, as: "defaultDepartment" }],
      });

      if (!category) {
        throw new Error("Category not found");
      }

      // If category has a default department, use it
      if (category.default_department_id) {
        return await Department.findByPk(category.default_department_id);
      }

      // Otherwise, find the closest department
      if (latitude && longitude) {
        const departments = await Department.findAll({
          where: { is_active: true },
          attributes: [
            "department_id",
            "name",
            "code",
            "latitude",
            "longitude",
            "sla_hours",
          ],
        });

        let bestDepartment = null;
        let shortestDistance = Infinity;

        for (const dept of departments) {
          if (dept.latitude && dept.longitude) {
            const distance = this.calculateDistance(
              latitude,
              longitude,
              dept.latitude,
              dept.longitude
            );

            if (distance < shortestDistance) {
              shortestDistance = distance;
              bestDepartment = dept;
            }
          }
        }

        return bestDepartment;
      }

      // Fallback: return first active department
      return await Department.findOne({ where: { is_active: true } });
    } catch (error) {
      console.error("Error finding best department:", error);
      throw error;
    }
  }

  // Calculate SLA deadline based on department and priority
  static calculateSLADeadline(departmentSLA, priority) {
    const now = new Date();
    let hours = departmentSLA;

    // Adjust SLA based on priority
    switch (priority) {
      case "critical":
        hours = Math.floor(hours * 0.5); // 50% of normal SLA
        break;
      case "high":
        hours = Math.floor(hours * 0.75); // 75% of normal SLA
        break;
      case "low":
        hours = Math.floor(hours * 1.5); // 150% of normal SLA
        break;
      default:
        // medium priority - use default SLA
        break;
    }

    const deadline = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return deadline;
  }

  // Calculate priority score based on issue metadata
  static calculatePriorityScore(issueData) {
    let score = 0;

    // Base score from category priority
    const categoryPriority = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    };
    score += categoryPriority[issueData.priority] || 50;

    // Bonus for urgent keywords in description
    const urgentKeywords = [
      "emergency",
      "urgent",
      "dangerous",
      "broken",
      "leak",
      "flood",
      "fire",
      "accident",
    ];
    const description = (issueData.description || "").toLowerCase();
    urgentKeywords.forEach((keyword) => {
      if (description.includes(keyword)) {
        score += 20;
      }
    });

    // Bonus for photos (indicates user effort and issue visibility)
    if (issueData.photos && issueData.photos.length > 0) {
      score += 15;
    }

    // Bonus for voice note (indicates user effort)
    if (issueData.voice_note) {
      score += 10;
    }

    return Math.min(score, 100); // Cap at 100
  }

  // Find available supervisor for assignment
  static async findAvailableSupervisor(departmentId, latitude, longitude) {
    try {
      const supervisors = await User.findAll({
        where: {
          role_id: 3, // supervisor role_id
          department_id: departmentId,
          is_active: true,
        },
        attributes: [
          "user_id",
          "name",
          "phone_number",
          "latitude",
          "longitude",
        ],
      });

      if (supervisors.length === 0) {
        return null;
      }

      // If location is provided, find the closest supervisor
      if (latitude && longitude) {
        let closestSupervisor = supervisors[0];
        let shortestDistance = Infinity;

        for (const supervisor of supervisors) {
          if (supervisor.latitude && supervisor.longitude) {
            const distance = this.calculateDistance(
              latitude,
              longitude,
              supervisor.latitude,
              supervisor.longitude
            );

            if (distance < shortestDistance) {
              shortestDistance = distance;
              closestSupervisor = supervisor;
            }
          }
        }

        return closestSupervisor;
      }

      // Otherwise, return the first available supervisor
      return supervisors[0];
    } catch (error) {
      console.error("Error finding available supervisor:", error);
      return null;
    }
  }

  // Auto-route an issue to the best department and supervisor
  static async autoRouteIssue(issueData) {
    try {
      // Find best department
      const department = await this.findBestDepartment(
        issueData.category_id,
        issueData.latitude,
        issueData.longitude
      );

      if (!department) {
        throw new Error("No suitable department found");
      }

      // Find available supervisor
      const supervisor = await this.findAvailableSupervisor(
        department.department_id,
        issueData.latitude,
        issueData.longitude
      );

      // Calculate SLA deadline
      const slaDeadline = this.calculateSLADeadline(
        department.sla_hours,
        issueData.priority
      );

      // Calculate priority score
      const priorityScore = this.calculatePriorityScore(issueData);

      return {
        assigned_department_id: department.department_id,
        assigned_supervisor_id: supervisor?.user_id || null,
        sla_deadline: slaDeadline,
        priority_score: priorityScore,
        routing_notes: `Auto-routed to ${department.name}${
          supervisor ? ` via ${supervisor.name}` : " (no supervisor available)"
        }`,
      };
    } catch (error) {
      console.error("Error in auto-routing:", error);
      throw error;
    }
  }
}

module.exports = AutoRoutingService;
