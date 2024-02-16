import { NextFunction } from "connect";
import { Request, Response } from "express";
import { ForgotPassword, Login, ResetPassword, SignUp } from "../utils/types";
import { compare } from "bcrypt";
import { hash, otp } from "../utils/utils";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./emailController";
import { JwtUtil } from "../utils/JwtUtil";

const prisma = new PrismaClient();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as Login;
  const { username, password } = data;

  try {
    const userDetails = await prisma.users.findFirst({
      where: {
        username,
      },
    });
    if (!userDetails?.id) {
      return res.json({
        status: false,
        message: "Username not exists",
      });
    }

    const match = await compare(password, userDetails.password || "");
    if (!match) {
      return res.json({
        status: false,
        message: "Password Invalid",
      });
    }

    return res.json({
      user: {
        username: userDetails.username,
        email: userDetails.email,
        id: userDetails.id,
      },
      token: JwtUtil.generateToken({ id: userDetails.id }),
      status: true,
    });
  } catch (error) {
    return res.json({
      status: false,
    });
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as SignUp;
  const { username, password, email } = data || {};

  try {
    const userDetails = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username,
            email,
          },
        ],
      },
    });

    if (userDetails?.id) {
      return res.json({
        status: false,
        message: "Username or Email already exists",
      });
    }
    const response = await prisma.users.create({
      data: {
        username,
        password: await hash(password),
        email,
      },
    });
    return res.json({
      user: {
        username: response.username,
        email: response.email,
        id: response.id,
      },
      status: true,
      token: JwtUtil.generateToken({ id: response.id }),
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as ForgotPassword;
  const { email } = data || {};

  try {
    const existingUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    const otpValue = otp();
    //TODO: send OTP via EMail

    await sendEmail(
      email,
      "FORGOT_PASSWORD",
      "OTP to Reset Your password is " + otpValue
    );

    await prisma.users.update({
      where: {
        id: existingUser?.id,
      },
      data: {
        otp: otpValue,
      },
    });
    return res.json({
      status: true,
      message: "OTP sent to " + email,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal Server Error!!!",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as ResetPassword;
  const { email, otp, newPassword } = data || {};

  try {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (!user?.otp || `${otp}` != String(user.otp)) {
      return res.json({
        status: false,
        message: "Incorrect OTP",
      });
    }
    await prisma.users.update({
      where: {
        id: user?.id,
      },
      data: {
        password: await hash(newPassword),
      },
    });
    return res.json({
      status: true,
      message: "Password Updated.",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal Server Error!!!",
    });
  }
};
