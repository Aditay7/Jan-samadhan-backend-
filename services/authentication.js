const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

function createTokenForUser(user) {
  const payload = {
    user_id: user.user_id,
    email: user.email,
    role_id: user.role_id,
  };
  const token = JWT.sign(payload, secret, { expiresIn: "7d" });
  return token;
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

module.exports = {
  createTokenForUser,
  validateToken,
};
