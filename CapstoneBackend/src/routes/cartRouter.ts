import express from "express";
import {
  addToCart,
  deleteFromCart,
  getUserCart,
  getUserOrders,
  placeOrder,
} from "../controllers/cartController";
import { tokenValidation } from "../middlewares/tokenValidation";

const router = express.Router();

router.get("/", tokenValidation, getUserCart);
router.get("/:productid/:count", tokenValidation, addToCart);
router.delete("/:id", tokenValidation, deleteFromCart);
router.post("/placeorder", tokenValidation, placeOrder);
router.get("/orders", tokenValidation, getUserOrders);

export const cartRouter = router;
