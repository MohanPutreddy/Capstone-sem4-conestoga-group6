import express from "express";
import multer from "multer";
import { addProduct, getProducts, getProductById } from "../controllers/productController";
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
router.post("/insert", tokenValidation, upload.single("file"), addProduct);
router.get("/:id", getProductById);

export const productRouter = router;
