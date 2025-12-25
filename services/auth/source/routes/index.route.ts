import authRouter from "./auth.route.js";
import healthRouter from "./health.route.js";
import express from "express";

const router = express
  .Router()
  .use("/auth", authRouter)
  .use("/health", healthRouter);

export default router;
