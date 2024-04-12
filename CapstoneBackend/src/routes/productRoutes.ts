import express from "express";
import multer from "multer";
import {
  addProduct,
  getProducts,
  getProductById,
  productReview,
  getProductReviews,
  deleteReview,
} from "../controllers/productController";
import { deleteProduct, editProduct } from "../controllers/productController";
import { tokenValidation } from "../middlewares/tokenValidation";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads");
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("file"), tokenValidation, addProduct);
router.put("/", upload.single("file"), tokenValidation, editProduct);
router.delete("/", tokenValidation, deleteProduct);
router.get("/ratings/:productid", tokenValidation, getProductReviews);
router.post("/rating", tokenValidation, productReview);
router.delete("/rating/:productid/:userid", tokenValidation, deleteReview);

export const productRouter = router;
