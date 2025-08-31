const User = require("../models/User");
const Role = require("../models/Role");
const {
  createTokenForUser,
  refreshAccessToken,
  getUserWithRole,
} = require("../services/authentication");

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, phone_number, address, role_name } =
      req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    let role;
    if (role_name && req.user?.role_name === "admin") {
      role = await Role.findOne({ where: { role_name } });
    } else {
      role = await Role.findOne({ where: { role_name: "Citizen" } });
    }

    if (!role) {
      return res.status(500).json({ message: "Default role not found" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone_number,
      address,
      role_id: role.role_id,
    });

    const tokens = createTokenForUser(user);

    res.status(201).json({
      message: "User registered successfully",
      ...tokens,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: role.role_name,
        permissions: role.permissions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "role" },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    await user.update({ last_login: new Date() });

    const tokens = createTokenForUser(user);

    res.json({
      message: "Login successful",
      ...tokens,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role.role_name,
        permissions: user.role.permissions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const RefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const tokens = await refreshAccessToken(refreshToken);
    if (!tokens) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    res.json({
      message: "Token refreshed successfully",
      ...tokens,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const GetProfile = async (req, res) => {
  try {
    const user = await getUserWithRole(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        profile_image_url: user.profile_image_url,
        role: user.role.role_name,
        permissions: user.role.permissions,
        is_verified: user.is_verified,
        last_login: user.last_login,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { name, phone_number, address } = req.body;
    const userId = req.user.user_id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone_number) updateData.phone_number = phone_number;
    if (address) updateData.address = address;

    await user.update(updateData);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        profile_image_url: user.profile_image_url,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await user.verifyPassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    await user.update({ password: newPassword });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const Logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to blacklist the refresh token
    // For now, we'll just return a success message
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  RefreshToken,
  GetProfile,
  UpdateProfile,
  ChangePassword,
  Logout,
};
