import express from "express";
import loginController from "~/controllers/login.controller.js";
import signupController from "~/controllers/signup.controller.js";
import logoutController from "~/controllers/logout.controller.js";
import resetPasswordController from "~/controllers/reset-password.controller.js";
import forgotPasswordController from "~/controllers/forgot-password.controller.js";
import refreshController from "~/controllers/refresh.controller.js";

const authRouter = express
  .Router()
  .post("/login", loginController)
  .post("/signup", signupController)
  .post("/logout", logoutController)
  .post("/reset-password", resetPasswordController)
  .post("/forgot-password", forgotPasswordController)
  .post("/refresh", refreshController);

export default authRouter;
