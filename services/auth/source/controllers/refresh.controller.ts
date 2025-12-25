import type { Request, Response } from "express";
import  refreshService  from "~/services/refresh.service.js";

export default async function refreshController(req: Request, res: Response) {
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
