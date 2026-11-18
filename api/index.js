require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./_lib/routes/auth");
const firmRoutes = require("./_lib/routes/firm");
const customerRoutes = require("./_lib/routes/customers");
const quotationRoutes = require("./_lib/routes/quotations");
const userRoutes = require("./_lib/routes/users");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Lightweight health check endpoint (can be reached without active DB)
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Cache MongoDB connection promise across serverless function invocations
let cachedDbPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  if (!cachedDbPromise) {
    cachedDbPromise = mongoose.connect(process.env.MONGO_URI).catch((err) => {
      cachedDbPromise = null;
      throw err;
    });
  }

  await cachedDbPromise;
};

// Middleware to ensure DB is connected before handling API resource requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error:", error.message);
    return res.status(500).json({
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/firm", firmRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
