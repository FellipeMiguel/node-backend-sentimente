/**
 * This script sets up and starts an Express server for a backend application.
 * It includes middleware for handling CORS, JSON parsing, URL-encoded data,
 * and session management. It also connects to a MongoDB database using Mongoose
 * and defines routes for authentication, classes, emotions, and dates.
 *
 * Environment Variables:
 * - PORT: The port on which the server will run (default: 5000).
 * - SESSION_SECRET: The secret key used for session management.
 * - MONGO_URI: The connection string for the MongoDB database.
 *
 * Middleware:
 * - CORS: Configured to allow requests from "http://localhost:5173" with credentials.
 * - express.json(): Parses incoming JSON requests.
 * - express.urlencoded(): Parses URL-encoded data.
 * - express-session: Manages user sessions with a secret and cookie configuration.
 *
 * Routes:
 * - /api/auth: Handles authentication-related operations.
 * - /api/classes: Handles operations related to classes.
 * - /api/emotions: Handles operations related to emotions.
 * - /api/dates: Handles operations related to dates.
 *
 * Database:
 * - Connects to MongoDB using the URI provided in the environment variables.
 *
 * Server:
 * - Starts the server on the specified PORT and logs the URL.
 */

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const classRoutes = require("./routes/classes");
const emotionRoutes = require("./routes/emotions");
const dateRoutes = require("./routes/dates");

const allowedOrigins = [
  "https://sentimente.vercel.app",
  "http://localhost:5173",
];

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `A origem: ${origin} não está autorizada!`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
