import express from "express";
import {
  listRentals,
  createRental,
  closeRental,
  deleteRental,
} from "../controllers/rentals.controllers.js";
import {
  validateNewRental,
  validateClosingRental,
} from "../middlewares/rentals.middlewares.js";

const router = express.Router();

router.get("/", listRentals);
router.post("/", validateNewRental, createRental);
router.post("/:id/return", validateClosingRental, closeRental);
router.delete("/:id", deleteRental);

export default router;
