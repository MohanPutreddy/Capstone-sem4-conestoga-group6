import { NextFunction, Request, Response } from "express";
import { ProductDetails } from "../utils/types";
import { PrismaClient } from "@prisma/client";

interface CustomRequest extends Request {
  file?: any;
}

const prisma = new PrismaClient();

export const addProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.json({
        status: false,
        message: "Failed to Upload Image",
      });
    }
    const image = req.file.filename;
    const { body } = req;
    const { authorname, bookname, description, price } = body as ProductDetails;

    const addedProduct = await prisma.products.create({
      data: {
        bookname,
        authorname,
        price,
        description,
        image,
      },
    });

    return res.json({
      status: true,
      product: addedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
    });
  }
};

export const getProducts = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const products = await prisma.products.findMany();
  return res.json({
    status: true,
    products,
  });
};
