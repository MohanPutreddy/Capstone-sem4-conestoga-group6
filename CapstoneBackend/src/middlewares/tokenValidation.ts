import { NextFunction, Request, Response } from "express";
import { JwtUtil } from "../utils/JwtUtil";

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || "";
    const valid = JwtUtil.verifyToken(token);
    if (!valid) {
      return res.status(401).json({
        status: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
    });
  }
};
