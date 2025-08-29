const User = require("../models/User");
const { createTokenForUser } = require("../services/authentication");

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, phone_number, address } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone_number,
      address,
    });

    const token = createTokenForUser(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
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

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createTokenForUser(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
};
