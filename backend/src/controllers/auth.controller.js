const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const log = require("../utils/auditLogger");
const { validateRegistrationInput, sanitizeUserResponse } =
  require("../utils/authValidation");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const validation = validateRegistrationInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ message: "Validation failed", errors: validation.errors });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUserResponse(user),
    });
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ AUDIT LOG - pass user info directly
    await log({
      req,
      action: "LOGIN_SUCCESS",
      targetType: "User",
      targetId: user._id,
      actor: user._id,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: sanitizeUserResponse(user),
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};
