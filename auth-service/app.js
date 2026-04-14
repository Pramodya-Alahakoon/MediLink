import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authrouter.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Auth Service is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal Server Error";

  res.status(statusCode).json({
    msg,
  });
});

export default app;
