import express from "express";
import {
  listCategories,
  createCategories,
} from "../controllers/categories.controllers.js";
import validateCategories from "../middlewares/categories.middlewares.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", validateCategories, createCategories);

export default router;
