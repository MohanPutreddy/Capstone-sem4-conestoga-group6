import { NextFunction, Request, Response } from "express";
import {
  DeletProduct,
  EditProductDetails,
  ProductDetails,
} from "../utils/types";
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
    const { authorname, bookname, description, price, categoryid, stock } =
      body as ProductDetails;

    const addedProduct = await prisma.products.create({
      data: {
        bookname,
        authorname,
        price,
        description,
        image,
        categoryid: +categoryid,
        stock: +stock,
      },
    });

    return res.json({
      status: true,
      product: addedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
    });
  }
};

export const editProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let image;
    if (req.file) {
      image = req.file.filename;
    }
    const { body } = req;
    const { authorname, bookname, description, price, categoryid, stock, id } =
      body as EditProductDetails;

    const existingDetails = await prisma.products.findFirst({
      where: {
        id: +id,
      },
    });
    if (!existingDetails) {
      return res.status(500).json({
        status: false,
        message: "Product doesnt exist",
      });
    }

    const addedProduct = await prisma.products.update({
      where: {
        id: +id,
      },
      data: {
        bookname: bookname || existingDetails.bookname,
        authorname: authorname || existingDetails.authorname,
        price: price || existingDetails.price,
        description: description || existingDetails.price,
        image: image || existingDetails.image,
        stock: +stock || existingDetails.stock,
      },
    });

    return res.json({
      status: true,
      product: addedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
    });
  }
};

export const deleteProduct = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;
    const { id } = body as DeletProduct;

    const addedProduct = await prisma.products.delete({
      where: {
        id: +id,
      },
    });

    return res.json({
      status: true,
    });
  } catch (error) {
    console.log(error);
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
    const { id } = req.params;

    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid product ID",
      });
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
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
