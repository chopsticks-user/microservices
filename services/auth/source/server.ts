import express from "express";
import "dotenv/config";
import router from "./routes/index.route.js";
import coreMiddleware from "./middlewares/core.middleware.js";

export const app = express().use(coreMiddleware).use("/", router);

const port = 3001;
app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`);
});
