import { users } from "@prisma/client";
import { Request } from "express";

export type Login = {
  username: string;
  password: string;
};

export type SignUp = {
  username: string;
  password: string;
  email: string;
};

export type ForgotPassword = {
  email: string;
};

export type ResetPassword = {
  otp: string;
  newPassword: string;
  email: string;
};

export type UserResponse = {
  userdetails?: users;
  status: boolean;
  message?: string | null;
};

export type ProductDetails = {
  bookname: string;
  authorname: string;
  price: string;
  description: string;
  image: string;
  categoryid: number;
  stock: number;
};

export type EditProductDetails = {
  bookname: string;
  authorname: string;
  price: string;
  description: string;
  image: string;
  categoryid: number;
  stock: number;
  id: number;
};

export type DeletProduct = {
  id: number;
};

export interface CustomRequest extends Request {
  id?: number;
  file?: any;
}
