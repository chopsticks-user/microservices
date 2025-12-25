import type { Request, Response } from "express";
import {
  loginService,
  logoutService,
  refreshService,
  signupService,
} from "~/services/auth.service.js";

export async function loginController(req: Request, res: Response) {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Invalid credentials",
    });
  }
}

export async function signupController(req: Request, res: Response) {
  try {
    const result = await signupService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Signup failed",
      message:
        error instanceof Error ? error.message : "Unable to create account",
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    const result = await logoutService(req.headers as Record<string, string>);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Logout failed",
      message: error instanceof Error ? error.message : "Unable to sign out",
    });
  }
}

export async function resetPasswordController(_req: Request, res: Response) {
  console.log("Resetting password...");
  res.status(200).json({});
}

export async function forgotPasswordController(_req: Request, res: Response) {
  console.log("Sending you an email...");
  res.status(200).json({});
}

export async function refreshController(req: Request, res: Response) {
  try {
    const result = await refreshService(req.headers as Record<string, string>);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      error: "Token refresh failed",
      message: error instanceof Error ? error.message : "Invalid session",
    });
  }
}
