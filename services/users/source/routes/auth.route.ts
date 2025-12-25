import express from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshController,
  resetPasswordController,
  signupController,
} from "~/controllers/auth.controller.js";

const authRouter = express
  .Router()
  .post("/login", loginController)
  .post("/signup", signupController)
  .post("/logout", logoutController)
  .post("/reset-password", resetPasswordController)
  .post("/forgot-password", forgotPasswordController)
  .post("/refresh", refreshController);

export default authRouter;
