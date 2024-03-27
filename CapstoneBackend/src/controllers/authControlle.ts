import { NextFunction } from "connect";
import { Request, Response } from "express";
import {
  CustomRequest,
  ForgotPassword,
  Login,
  ResetPassword,
  SignUp,
  User,
} from "../utils/types";
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

    if (!userDetails.isactive) {
      return res.json({
        status: false,
        message: "Account Disabled by Admin",
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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.users.findMany({});
    res.json(users);
  } catch (error) {
    return res.json({
      status: false,
    });
  }
};

export const adminLogin = async (
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

    if (userDetails.role?.toLowerCase() !== "admin") {
      return res.json({
        status: false,
        message: "Disabled login for regular users in Admin portal",
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

  console.log({ username, password, email });

  try {
    const userDetails = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    console.log(userDetails);

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
        role: "regular",
        isactive: true,
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

export const signupAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as SignUp;
  const { username, password, email } = data || {};

  console.log({ username, password, email });

  try {
    const userDetails = await prisma.users.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    console.log(userDetails);

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
        role: "admin",
        isactive: true,
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

export const getProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req;
    const profile = await prisma.users.findFirst({
      where: {
        id,
      },
    });
    return res.json({
      status: true,
      profile,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal Server Error!!!",
    });
  }
};

export const saveProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, body } = req;
    const { file, ...rest } = body;
    const data = {
      ...rest,
    };
    const profileimage = req?.file?.filename || "";
    profileimage && (data.profileimage = profileimage);

    if (!id) {
      return res.json({
        status: false,
        message: "Invalid user id",
      });
    }

    const userDetails = await prisma.users.update({
      where: {
        id: +id,
      },
      data,
    });

    return res.json({
      status: true,
      profile: {
        ...userDetails,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal Server Error!!!",
    });
  }
};

export const editUserProfileByAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, body } = req;
    const { userid } = req.params;
    const { file, ...rest } = body;
    const data = {
      ...rest,
    };
    const profileimage = req?.file?.filename || "";
    profileimage && (data.profileimage = profileimage);

    if (!id || !userid) {
      return res.json({
        status: false,
        message: "Invalid user id",
      });
    }

    const userDetails = await prisma.users.update({
      where: {
        id: +userid,
      },
      data,
    });

    return res.json({
      status: true,
      profile: {
        ...userDetails,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal Server Error!!!",
    });
  }
};

export const editAccountStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, body } = req;

    if (!id || !body.id) {
      return res.json({
        status: false,
        message: "Invalid user id",
      });
    }

    const userDetails = await prisma.users.update({
      where: {
        id: +body.id,
      },
      data: {
        isactive: body?.accountstatus,
      },
    });

    return res.json({
      status: true,
      profile: {
        ...userDetails,
      },
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal Server Error!!!",
    });
  }
};
