import { NextFunction, Request, Response } from "express";
import { JwtUtil } from "../utils/JwtUtil";
import { CustomRequest } from "../utils/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export const isUserAdmin = async (
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
    const details = await prisma.users.findFirst({
      where: {
        id: +valid.id,
      },
    });
    console.log(details);
    if (!details || details.role?.toLowerCase() !== "admin") {
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
