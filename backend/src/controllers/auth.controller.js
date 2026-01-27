const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateRegistrationInput, sanitizeUserResponse } = require("../utils/authValidation");

/**
 * Register a new user
 * Returns JWT token for immediate login
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Input validation
    const validation = validateRegistrationInput(req.body);
    if (!validation.isValid) {
      console.log("❌ Registration validation failed:", validation.errors);
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.errors
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log(`❌ Registration failed: User already exists (${email})`);
      return res.status(400).json({
        message: "User already exists with this email address"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    console.log(`✅ User registered successfully: ${user.email} (${user.role})`);

    // Generate JWT token (same as login)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user data (consistent with login response)
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUserResponse(user)
    });

  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * Login existing user
 * Returns JWT token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`❌ Login failed: User not found (${email})`);
      return res.status(404).json({
        message: "Invalid email or password"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Login failed: Invalid password (${email})`);
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`✅ User logged in successfully: ${user.email} (${user.role})`);

    res.json({
      message: "Login successful",
      token,
      user: sanitizeUserResponse(user)
    });

  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({
      message: "Login failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
