import express from "express";
import {
  getAllCategories,
  insertCategory,
} from "../controllers/categoriesController";
import { tokenValidation } from "../middlewares/tokenValidation";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", tokenValidation, insertCategory);

export const catRouter = router;
