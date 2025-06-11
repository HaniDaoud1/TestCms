const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth.js");
const { upload } = require("../cloudinary.js");

const router = express.Router();

// REGISTER
router.post("/register", upload.single("picture"), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email ou nom d'utilisateur déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const picturePath = req.file?.path || "";

    const user = new User({
      username,
      email,
      password: hashedPassword,
      picturePath,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      picturePath: user.picturePath,
    };

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      username: user.username,
      picturePath: user.picturePath,
    };

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
});

// GET ME
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("username");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
