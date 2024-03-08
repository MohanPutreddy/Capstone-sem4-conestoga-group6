import express from "express";
import {
  addToCart,
  deleteFromCart,
  getUserCart,
} from "../controllers/cartController";
import { tokenValidation } from "../middlewares/tokenValidation";

const router = express.Router();

router.get("/", tokenValidation, getUserCart);
router.get("/:productid/:count", tokenValidation, addToCart);
router.delete("/:id", tokenValidation, deleteFromCart);

export const cartRouter = router;
