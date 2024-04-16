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
import fs from "fs";
import pdf from "html-pdf";

const prisma = new PrismaClient();

dotenv.config();

const app = express();
const stripe = require("stripe")(process.env.STRIPE_KEY);
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("public"));
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
        const productPrice = product.discountpercent ? ((parseFloat(product.price) * ((100 - product.discountpercent) / 100)) * 100) : parseFloat(product.price) * 100;

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

//Backend to handle invoice generation
app.post("/cart/download-invoice", async (req, res) => {
  try {
    // Extract the order ID from the request body
    const { orderId } = req.body;

    //Finding the details about the order to get the paymentId to display in the invoice
    const order_details = await prisma.orders.findUnique({
      where: {
        orderid: orderId,
      },
      select: {
        userid: true,
        paymentid: true,
        date: true,
        total: true
      }
    });

    //Finding the details of the User name to display in the invoice
    const user_details = await prisma.users.findUnique({
      where: {
        id: order_details?.userid,
      },
      select: {
        firstname: true,
        lastname: true
      }
    });

    //console.log(order_details?.paymentid, "line 106, server.ts");
    //console.log(user_details?.firstname, user_details?.lastname, "line 115 server.ts");


    const order_items = await prisma.order_item.findMany({
      where: {
        orderid: orderId,
      },
    });
    //console.log(orderId, "server.ts, line 112");
    //console.log(order_items, "server.ts line 113");
    let obj = [];
    for (let j = 0; j < order_items.length; j++) {
      const { id, itemid, orderid, price, quantity } = order_items[j];
      const productDetails = await prisma.products.findFirst({
        where: {
          id: itemid,
        },
        select: {
          bookname: true
        }
      });
      //console.log("Book", j, productDetails?.bookname, price, quantity, orderid, "Line 122, server.ts");

      //Temp Obj to store the combined data from the objects retreived until now
      const tempObj = { ...order_details, ...user_details, ...productDetails, ...order_items[j] };

      //Pushing to a new empty obj array, so that we have as many objects as we have the particular order
      obj.push(tempObj)

    }
    //console.log(obj, "Final run");


    const htmlContent = generateInvoiceHTML(obj);
    //console.log(htmlContent);

    // Define options for PDF generation
    const options: pdf.CreateOptions = {
    };

    // Generate PDF from HTML content
    pdf.create(htmlContent, options).toStream((err, stream) => {
      if (err) {
        console.error("Error generating PDF:", err);
        res.status(500).json({ error: "Error generating PDF" });
      } else {
        // Set response headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="invoice_${orderId}.pdf"`);

        // Pipe the PDF stream to the response
        stream.pipe(res);
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({});
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT || 3000
    }`
  );
});

// Function to generate HTML content for the invoice
function generateInvoiceHTML(obj: any) {
  // Generate HTML content based on order details
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
      }

      .header {
          display: flex;
          justify-content: space-between;
      }

      table {
          width: 100%;
          border-collapse: collapse;
      }

      th,
      td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
      }

      th {
          background-color: #f2f2f2;
      }

      .footerNotes {
          margin-top: 50px;
          font-style: italic;
      }

      .ImageContainer img {
          height: 100px;
          width: auto;
          margin-left: 43%;
      }

      .ImageContainer {
          display: flex;
          justify-content: space-around;
          background: #004080;
          color: #ddd;
          align-items: center;
      }

      .productList {
          display: flex;
          justify-content: center;
      }

      .productList table {
          width: 75%;
      }
        </style>
    </head>
    <body>
        <div class="ImageContainer">
          <img src="https://capstone-sem4-conestoga-group6-plla.vercel.app/static/media/logo.5758b3a5c9573f29f83e.png" alt="Logo"></img>
          
        </div>
        <h1>Invoice</h1>
        <div class="header">
              <p><strong>Order ID: </strong>${obj[0].orderid}</p>
              <p><strong>Order Date: </strong>${obj[0].date}</p>
              <p><strong>Total: </strong>CAD ${obj[0].total.toFixed(2)}</p>
              <p><strong>Payment ID: </strong>${obj[0].paymentid}</p>
        </div>
        <h3>Items in this Order</h3>
        <div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
  `;
  obj.forEach((item: any) => {
    htmlContent += `
      <tr>
        <td>${item.bookname}</td>
        <td>${item.quantity}</td>
        <td>CAD ${item.price.toFixed(2)}</td>
      </tr>
    `;
  });
  htmlContent += `
          </tbody>
        </table>
        </div>
        <p class="footerNotes"><strong>Note: </strong>This is an order invoice generated upon user's request. Any dispute in
        this invoice should be
        immediately informed to us within 7 business days after placement of the order.</p>
    </body>
    </html>
  `;
  return htmlContent;
}

