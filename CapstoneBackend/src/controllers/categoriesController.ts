import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany();

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error",
    });
  }
};

export const insertCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        error: "Category name is required",
      });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      status: true,
      category: newCategory,
    });
  } catch (error) {
    console.error("Error inserting category:", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error",
    });
  }
};
