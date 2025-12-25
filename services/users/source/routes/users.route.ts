import express from "express";

const usersRouter = express.Router().get("/", (_req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

export default usersRouter;
