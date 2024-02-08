import { NextFunction, Request, Response } from "express";
import { ForgotPassword, Login, SignUp } from "../utils/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as Login;
    const { username, password } = data;
    if (!username || !password) {
      return res.json({
        status: false,
        message: "Username/password cannot be empty",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
    });
  }
};

export const signUpValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as SignUp;
    const { username, password, email } = data;
    if (!username || !password || !email) {
      return res.json({
        status: false,
        message: "Username/password/email cannot be empty",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
    });
  }
};

export const emailExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as ForgotPassword;
    const { email } = data;
    if (!email) {
      return res.json({
        status: false,
        message: "Username/password/email cannot be empty",
      });
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.json({
        status: false,
        message: "Email Not Exists in the system.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
