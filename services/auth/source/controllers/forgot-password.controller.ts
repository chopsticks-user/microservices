import type { Request, Response } from "express";

export default function forgotPasswordController(_req: Request, res: Response) {
  res.status(200).json({});
}
