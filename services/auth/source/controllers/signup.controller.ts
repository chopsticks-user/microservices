import type { Request, Response } from "express";
import signupService from "~/services/signup.service.js";
import type { SignUp } from "~/utilities/models.d.ts";

export default async function signupController(req: Request, res: Response) {
  try {
    const result = await signupService(req.body as SignUp);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Signup failed",
      message:
        error instanceof Error ? error.message : "Unable to create account",
    });
  }
}
