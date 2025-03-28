const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Error during registration." });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Buscar usuário por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login." });
  }
});

// Rota de Logout (frontend remove o token)
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully!" });
});

// Rota de Dashboard (apenas para usuários autenticados)
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("classes");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "Dashboard data retrieved successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        classes: user.classes,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Error fetching dashboard data." });
  }
});

module.exports = router;
