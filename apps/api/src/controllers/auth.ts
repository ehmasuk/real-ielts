import type { Request, Response } from "express";

const registerUser = async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Register endpoint" });
};

const loginUser = async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Login endpoint" });
};

export default {
  registerUser,
  loginUser,
};
