import express from "express";
import mongoose from "mongoose";
import { errorHandler } from "./shared/error.middleware";
import authRoutes from "./modules/auth/auth.routes"
import cookieParser from "cookie-parser"


const app = express();
app.use(cookieParser())
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.get("/", (_req, res) => {
  res.send("Ledger Service is up and running");
});

app.get("/health", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "unavailable",
    db: dbConnected ? "connected" : "disconnected",
  });
});



app.use("/api/auth", authRoutes)

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default app;
