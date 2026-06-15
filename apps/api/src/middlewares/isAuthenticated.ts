import type { NextFunction, Response } from "express";

import userServices from "../lib/user/index.js";
import type { CustomRequest } from "../types/index.js";
import newError from "../utils/newError.js";
import { verifyToken } from "../utils/tokenHandlers.js";

const isAuthenticated = async (req: CustomRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw newError({ message: "Please login first", statusCode: 404 });
    }
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw newError({ message: "Please login first", statusCode: 404 });
    }

    const validUser = verifyToken(token);
    if (!validUser) {
      throw newError({ message: "Invalid token", statusCode: 400 });
    }

    const user = await userServices.findOne({ filter: { _id: validUser.id } });
    if (!user) {
      throw newError({ message: "User not found", statusCode: 404 });
    }

    req.user = { id: user.id };
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
