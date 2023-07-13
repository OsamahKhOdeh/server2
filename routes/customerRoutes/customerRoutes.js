import express from "express";
import { createCustomer } from "../../controllers/customerControllers/customerControllers.js";
import { getAllCustomers } from "../../controllers/customerControllers/customerControllers.js";
import { updateCustomer } from "../../controllers/customerControllers/customerControllers.js";
import { getCustomerById } from "../../controllers/customerControllers/customerControllers.js";
import { deleteCustomer } from "../../controllers/customerControllers/customerControllers.js";
const router = express.Router();

// Create a new customer
router.post("/", createCustomer);

// Get all customers
router.get("/", getAllCustomers);

// Get a customer by ID
router.get("/:id", getCustomerById);

// Update a customer
router.put("/:id", updateCustomer);

// Delete a customer
router.delete("/:id", deleteCustomer);

export default router;
