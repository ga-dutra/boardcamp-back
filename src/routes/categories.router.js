import express from "express";
import {
  listCategories,
  postCategories,
} from "../controllers/categories.controllers.js";
import validateCategories from "../middlewares/categories.middlewares.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", validateCategories, postCategories);

export default router;
