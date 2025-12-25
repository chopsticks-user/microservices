import type { Request, Response } from "express";
import logoutService from "~/services/logout.service.js";

export default async function logoutController(req: Request, res: Response) {
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
