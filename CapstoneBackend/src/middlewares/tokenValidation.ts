import { NextFunction, Request, Response } from "express";
import { JwtUtil } from "../utils/JwtUtil";
import { CustomRequest } from "../utils/types";

export const tokenValidation = (
  req: CustomRequest,
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
    req.id = valid.id;
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
    });
  }
};
