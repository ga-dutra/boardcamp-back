import express from "express";
import {
  listCustomers,
  listCustomersById,
  createCustomer,
  updateCustomer,
} from "../controllers/customers.controllers.js";
import validateCustomer from "../middlewares/customers.middlewares.js";

const router = express.Router();

router.get("/", listCustomers);
router.get("/:id", listCustomersById);
router.post("/", validateCustomer, createCustomer);
router.put("/:id", validateCustomer, updateCustomer);

export default router;
