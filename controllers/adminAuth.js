const { User, Role, Department } = require("../models");
const { createTokenForUser } = require("../services/authentication");
const { body } = require("express-validator");

// Web dashboard login (Admin/Department)
const WebLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user by username (for admin/department users)
    const user = await User.findOne({
      where: { username },
      include: [
        { model: Role, as: "role" },
        { model: Department, as: "department" },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if user is web dashboard user (admin or department)
    if (!["admin", "department_officer"].includes(user.role.role_name)) {
      return res
        .status(403)
        .json({
          message: "Access denied. Web login not allowed for this user type.",
        });
    }

    // Verify password
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate tokens
    const tokens = createTokenForUser(user);

    res.json({
      message: "Login successful",
      ...tokens,
      user: {
        id: user.user_id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role.role_name,
        permissions: user.role.permissions,
        department: user.department
          ? {
              id: user.department.department_id,
              name: user.department.name,
              code: user.department.code,
            }
          : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin creates department user
const CreateDepartmentUser = async (req, res) => {
  try {
    const { name, username, password, email, department_id, contact_phone } =
      req.body;
    const adminId = req.user.user_id;

    // Check if admin
    if (req.user.role_name !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create department users" });
    }

    // Validate department exists
    const department = await Department.findByPk(department_id);
    if (!department) {
      return res.status(400).json({ message: "Department not found" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Get department officer role
    const deptRole = await Role.findOne({
      where: { role_name: "department_officer" },
    });

    // Create department user
    const user = await User.create({
      name,
      username,
      password,
      email,
      phone_number: contact_phone,
      role_id: deptRole.role_id,
      department_id,
      login_method: "password",
      created_by: adminId,
      is_verified: true,
    });

    res.status(201).json({
      message: "Department user created successfully",
      user: {
        id: user.user_id,
        name: user.name,
        username: user.username,
        email: user.email,
        department: {
          id: department.department_id,
          name: department.name,
          code: department.code,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Department creates supervisor
const CreateSupervisor = async (req, res) => {
  try {
    const { name, phone_number, email, address } = req.body;
    const deptUserId = req.user.user_id;

    // Check if department officer
    if (req.user.role_name !== "department_officer") {
      return res
        .status(403)
        .json({ message: "Only department officers can create supervisors" });
    }

    // Get user's department
    const user = await User.findByPk(deptUserId, {
      include: [{ model: Department, as: "department" }],
    });

    if (!user.department) {
      return res
        .status(400)
        .json({ message: "Department not assigned to user" });
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ where: { phone_number } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // Get supervisor role
    const supervisorRole = await Role.findOne({
      where: { role_name: "supervisor" },
    });

    // Create supervisor
    const supervisor = await User.create({
      name,
      phone_number,
      email,
      address,
      role_id: supervisorRole.role_id,
      department_id: user.department.department_id,
      login_method: "otp",
      created_by: deptUserId,
      is_phone_verified: false,
    });

    res.status(201).json({
      message: "Supervisor created successfully",
      supervisor: {
        id: supervisor.user_id,
        name: supervisor.name,
        phone_number: supervisor.phone_number,
        supervisor_code: supervisor.supervisor_code,
        department: {
          id: user.department.department_id,
          name: user.department.name,
          code: user.department.code,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users by role (admin only)
const GetUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const adminId = req.user.user_id;

    // Check if admin
    if (req.user.role_name !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const roleRecord = await Role.findOne({ where: { role_name: role } });
    if (!roleRecord) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const users = await User.findAll({
      where: { role_id: roleRecord.role_id },
      include: [
        { model: Role, as: "role" },
        { model: Department, as: "department" },
      ],
      attributes: { exclude: ["password", "otp", "otp_expires_at"] },
    });

    res.json({
      users: users.map((user) => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        username: user.username,
        role: user.role.role_name,
        department: user.department
          ? {
              id: user.department.department_id,
              name: user.department.name,
              code: user.department.code,
            }
          : null,
        is_active: user.is_active,
        created_at: user.created_at,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Validation middleware
const validateWebLogin = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateCreateDepartmentUser = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("department_id").isInt().withMessage("Valid department ID is required"),
];

const validateCreateSupervisor = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("phone_number")
    .isMobilePhone("any")
    .withMessage("Valid phone number is required"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters"),
];

module.exports = {
  WebLogin,
  CreateDepartmentUser,
  CreateSupervisor,
  GetUsersByRole,
  validateWebLogin,
  validateCreateDepartmentUser,
  validateCreateSupervisor,
};
