import { NextFunction, Request, Response } from "express";
import {
  CustomRequest,
  DeletProduct,
  EditProductDetails,
  ProductDetails,
} from "../utils/types";
import { discountedPRice } from "../utils/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const deleteReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userid = req.id;
    const { productid } = req.params;

    if (!userid) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    if (!productid) {
      return res.status(400).json({
        status: false,
        message: "ProductID not available in parameters",
      });
    }

    const existingReview = await prisma.ratings.findFirst({
      where: {
        productid: parseInt(productid),
        userid: +userid,
      },
    });

    if (!existingReview) {
      return res.json({
        status: false,
        message: "Review not found for the provided user and product",
      });
    }

    await prisma.ratings.delete({
      where: {
        id: existingReview.id,
      },
    });

    return res.json({
      status: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
export const getProductReviews = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productid } = req.params;
    const userid = req.id;

    if (!productid) {
      return res.json({
        status: false,
        message: "ProductID not available",
      });
    }

    const records = await prisma.ratings.findMany({
      where: {
        productid: +productid,
      },
    });

    const userRating = await prisma.ratings.findMany({
      where: {
        productid: +productid,
        userid,
      },
    });

    const avgRatingInfo = await prisma.ratings.aggregate({
      where: {
        productid: +productid,
      },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const avgRating = avgRatingInfo?._avg?.rating || 0;
    const totalReviewsCount = avgRatingInfo?._count || 0;

    return res.json({
      records,
      userRating,
      avgRating,
      totalReviewsCount,
    });
  } catch (error) {
    res.json({
      status: false,
    });
  }
};

export const productReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productid, rating, review } = req.body;
    const userid = req.id;

    if (!productid) {
      return res.json({
        status: false,
        message: "ProductID not available",
      });
    }

    if (!userid) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const user = await prisma.users.findFirst({
      where: {
        id: userid,
      },
    });

    const productDetails = await prisma.products.findFirst({
      where: {
        id: +productid,
      },
    });

    if (!productDetails) {
      return res.json({
        status: false,
        message: "ProductID not available",
      });
    }

    if (isNaN(+rating)) {
      return res.json({
        status: false,
        message: "Invalid Rating",
      });
    }

    let existingRating = await prisma.ratings.findFirst({
      where: {
        productid: +productid,
        userid: +userid,
      },
    });

    if (existingRating) {
      const updateData: { rating?: number; review?: string } = {};
      if (rating !== undefined && rating !== null) {
        updateData.rating = +rating;
      }
      if (review) {
        updateData.review = review;
      }

      existingRating = await prisma.ratings.update({
        where: {
          id: existingRating.id,
        },
        data: updateData,
      });
    } else {
      existingRating = await prisma.ratings.create({
        data: {
          productid: +productid,
          userid: +userid,
          rating: rating || null,
          review: review || null,
          username: user?.username,
        },
      });
    }

    return res.json({
      status: true,
      message: "Review submitted successfully",
      ...existingRating,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

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
    const {
      authorname,
      bookname,
      description,
      price,
      categoryid,
      stock,
      discountpercent,
    } = body as ProductDetails;

    const addedProduct = await prisma.products.create({
      data: {
        bookname,
        authorname,
        price,
        description,
        image,
        categoryid: +categoryid,
        stock: +stock,
        discountpercent: +discountpercent,
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
    const {
      authorname,
      bookname,
      description,
      price,
      categoryid,
      stock,
      id,
      discountpercent,
    } = body as EditProductDetails;

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
        discountpercent: !!discountpercent ? +discountpercent : 0,
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
    products: products.map((obj) => {
      return {
        ...obj,
        salePrice: discountedPRice(+obj.price, obj.discountpercent || 0),
      };
    }),
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

    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }

    res.json({
      status: true,
      product: {
        ...product,
        salePrice: discountedPRice(
          +product.price,
          product.discountpercent || 0
        ),
      },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ status: false });
  }
};
