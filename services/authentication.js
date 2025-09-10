const JWT = require("jsonwebtoken");
const { User, Role } = require("../models");

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

function createTokenForUser(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    role_id: user.role_id,
    role_name: (user.role?.role_name || "citizen").toLowerCase(),
  };

  const accessToken = JWT.sign(payload, secret, { expiresIn: "15m" });
  const refreshToken = JWT.sign({ user_id: user.user_id }, refreshSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token validation Failed: ", err.message);
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    const payload = JWT.verify(token, refreshSecret);
    return payload;
  } catch (err) {
    console.error("Refresh token validation Failed: ", err.message);
    return null;
  }
}

async function refreshAccessToken(refreshToken) {
  const payload = validateRefreshToken(refreshToken);
  if (!payload) {
    return null;
  }

  const user = await User.findOne({
    where: { user_id: payload.user_id },
    include: { model: Role, as: "role" },
  });

  if (!user) {
    return null;
  }

  return createTokenForUser(user);
}

async function getUserWithRole(userId) {
  return await User.findOne({
    where: { user_id: userId },
    include: { model: Role, as: "role" },
  });
}

function hasPermission(userPermissions, resource, action) {
  if (!userPermissions || !userPermissions[resource]) {
    return false;
  }

  return (
    userPermissions[resource].includes(action) ||
    userPermissions[resource].includes("all")
  );
}

module.exports = {
  createTokenForUser,
  validateToken,
  validateRefreshToken,
  refreshAccessToken,
  getUserWithRole,
  hasPermission,
};
