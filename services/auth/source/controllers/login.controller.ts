import type { Request, Response } from "express";
import  loginService  from "~/services/login.service.js";
import type { Login } from "~/utilities/models.d.ts";

export default async function loginController(req: Request, res: Response) {
  try {
    const result = await loginService(req.body as Login);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Invalid credentials",
    });
  }
}
