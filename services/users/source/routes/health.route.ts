import express from "express";

const healthRouter = express.Router().get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

export default healthRouter;
