require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const classRoutes = require("./routes/classes");
const emotionRoutes = require("./routes/emotions");
const dateRoutes = require("./routes/dates");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/emotions", emotionRoutes);
app.use("/api/dates", dateRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
