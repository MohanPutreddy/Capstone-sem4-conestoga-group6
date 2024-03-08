import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        status: false,
      });
    }

    const { productid, count } = req.params || {};
    if (!productid) {
      return res.status(401).json({
        status: false,
        message: "Product ID is required",
      });
    }

    const existingCartEntry = await prisma.cart.findFirst({
      where: {
        AND: [
          {
            userid: +req.id,
          },
          {
            productid: +productid,
          },
        ],
      },
    });

    if (existingCartEntry) {
      await prisma.cart.update({
        where: {
          id: existingCartEntry.id,
        },
        data: {
          count: +count || 0,
        },
      });
    } else {
      await prisma.cart.create({
        data: {
          userid: +req.id,
          productid: +productid,
          count: +count || 0,
        },
      });
    }

    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Error",
    });
  }
};

export const getUserCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        status: false,
      });
    }

    const cart = await prisma.cart.findMany({
      where: {
        userid: +req.id,
      },
    });

    const output = [];

    for (let i = 0; i < cart?.length; i++) {
      const obj = cart[i];
      const product = await prisma.products.findFirst({
        where: {
          id: +obj.productid,
        },
      });
      output.push({
        ...cart[i],
        productdetails: product,
      });
    }

    return res.status(200).json({
      status: true,
      cart: output,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Error",
    });
  }
};

export const deleteFromCart = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        status: false,
      });
    }

    const { id } = req.params || {};
    if (!id) {
      return res.status(401).json({
        status: false,
        message: "Product ID is required",
      });
    }
    const _res = await prisma.cart.delete({
      where: {
        id: +id,
      },
    });

    console.log(_res);

    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Error",
    });
  }
};
