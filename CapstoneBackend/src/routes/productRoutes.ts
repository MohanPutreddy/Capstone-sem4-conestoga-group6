import express from "express";
import multer from "multer";
import { addProduct, getProducts } from "../controllers/productController";

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
router.post("/insert", upload.single("file"), addProduct);

export const productRouter = router;
