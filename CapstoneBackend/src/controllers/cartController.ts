import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/types";
import { PrismaClient } from "@prisma/client";
import { discountedPRice } from "../utils/utils";

const prisma = new PrismaClient();

export const getUserOrders = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.json({ status: false, message: "User id missing" });
    }
    const orders = await prisma.orders.findMany({
      where: {
        userid: +userid!,
      },
    });

    let output = [];
    for (let i = 0; i < orders.length; i++) {
      const { date, orderid, paymentid, total, userid } = orders[i];
      let obj = {
        date,
        orderid,
        paymentid,
        total,
        userid,
        items: [] as any,
      };
      const orderItems = await prisma.order_item.findMany({
        where: {
          orderid,
        },
      });
      for (let j = 0; j < orderItems.length; j++) {
        const { id, itemid, orderid, price, quantity } = orderItems[j];
        const productDetails = await prisma.products.findFirst({
          where: {
            id: itemid,
          },
        });
        const userRating = await prisma.ratings.findFirst({
          where: {
            productid: productDetails?.id,
            userid: userid,
          },
        });
        obj.items.push({
          itemid,
          orderid,
          price,
          quantity,
          userRating,
          ...productDetails,
        });
      }
      output.push(obj);
    }
    res.json([...(output || [])]);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Error",
    });
  }
};

export const placeOrder = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userid = req.id;
    const cart = await prisma.cart.findMany({
      where: {
        userid: userid!,
      },
    });

    if (cart?.length === 0) {
      return res.json({
        status: false,
        message: "Cart is Empty cannot place order",
      });
    }

    await prisma.cart.deleteMany({
      where: {
        userid: userid!,
      },
    });

    const paymentid = new Date().getTime();
    let order_items = [];
    let total = 0;
    let itemTotal = 0;

    for (let i = 0; i < cart?.length; i++) {
      const obj = cart[i];
      const product = await prisma.products.findFirst({
        where: {
          id: +obj.productid,
        },
      });
      if (product) {
        const productPrice = product.discountpercent
          ? parseFloat(product.price) * ((100 - product.discountpercent) / 100)
          : parseFloat(product.price);
        const tax = productPrice * 0.13;
        console.log(tax, "Line 111 in cartController.js");
        itemTotal = (productPrice + tax) * obj.count;
        total += itemTotal;
        console.log(itemTotal, "Line 115 in cartController.js, For Item", obj);
        console.log(total, "Line 116 in cartController.js");
        order_items.push({
          itemid: +obj.productid,
          quantity: obj.count,
          price: itemTotal,
        });
      }
    }

    console.log(order_items, "line 122 in carController.js");

    const orderDetails = await prisma.orders.create({
      data: {
        userid: userid!,
        total,
        paymentid: `${paymentid}`,
        date: new Date().toDateString(),
      },
    });

    console.log(orderDetails);

    for (let i = 0; i < order_items.length; i++) {
      await prisma.order_item.create({
        data: {
          orderid: orderDetails.orderid!,
          ...order_items[i],
        },
      });
    }

    res.json({
      status: true,
      orderDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal Error",
    });
  }
};

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
      if (product) {
        output.push({
          ...cart[i],
          productdetails: {
            ...product,
            salePrice: discountedPRice(
              +product.price,
              product.discountpercent || 0
            ),
          },
        });
      }
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
