import express from "express";
import {
  getAllCategories,
  insertCategory,
} from "../controllers/categoriesController";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", insertCategory);

export const catRouter = router;
