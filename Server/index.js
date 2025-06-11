const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const articlesRoutes = require("./routes/articles");
const { verifyToken } = require("./middleware/auth.js");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://test-cms-3t6l.vercel.app"], // autoriser ton frontend React
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/article", verifyToken, articlesRoutes);

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connecté");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Serveur sur http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur MongoDB:", err));
