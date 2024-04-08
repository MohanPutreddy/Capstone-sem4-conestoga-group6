import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { userAuthRouter } from "./routes/authRoutes";
import cors from "cors";
import { productRouter } from "./routes/productRoutes";
import path from "path";
import { catRouter } from "./routes/categoryRoutes";
import { cartRouter } from "./routes/cartRouter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config();

const app = express();
const stripe = require("stripe")(process.env.STRIPE_KEY);
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));
app.use("/userauth", userAuthRouter);
app.use("/product", productRouter);
app.use("/category", catRouter);
app.use("/cart", cartRouter);

//Backend to handle the stripe payments
app.post("/payment", async (req, res) => {
  /* console.log("Data at backend ", req.body); */
  try {
    //Getting the Cart's products from the userID, as we need to keep the site secure, if we send the cart data from frontend
    //then there is a posiblity of data intervention enroute to server and prices can be made 0 and get things for free
    const cartDetails = await prisma.cart.findMany({
      where: { userid: req.body.userId },
    });
    //  console.log("Cart Details:", cartDetails);

    //Here we are getting the book name and its count and storing it in an array, so that we can send it to the stripe
    const productDetails = [];

    const taxRate = await stripe.taxRates.create({
      // Here
      display_name: "Sales Tax",
      percentage: 13,
      inclusive: false,
    });

    for (const cartItem of cartDetails) {
      const product = await prisma.products.findUnique({
        where: { id: cartItem.productid },
      });
      if (product) {
        const productName = product.bookname;
        const productPrice = product.discountpercent ? ( (parseFloat(product.price) * ((100 - product.discountpercent)/100)) * 100) : parseFloat(product.price) * 100;

        // console.log(productPrice, product.price, product.discountpercent);
        //  /*  */console.log(product.discountpercent, "server.ts, line 54");
        productDetails.push({
          price_data: {
            currency: "cad",
            product_data: {
              name: productName,
            },

            unit_amount: productPrice,
          },
          quantity: cartItem.count,
          tax_rates: [taxRate.id],
        });
      }
    }
    /* console.log(productDetails); */

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: productDetails,
      success_url: "http://localhost:4000/paymentsuccess",
      cancel_url: "http://localhost:4000/paymentfailure",
    });
    res.json({ url: session.url });
    /* 
        console.log(session.url); */
  } catch (error) {
    console.error("Error processing payment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({});
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `[server]: Server is running at http://localhost:${
      process.env.PORT || 3000
    }`
  );
});
