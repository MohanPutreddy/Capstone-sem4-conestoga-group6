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

export const getProductById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction

) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });
    if (product) {
      res.json({ status: true, product });
    } else {
      res.status(404).json({ status: false, message: "Product not found" });
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ status: false });
  }
};
