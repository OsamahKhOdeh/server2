import express from "express";
import { createWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse, deleteWarehouse } from "../../controllers/warehouseControllers/warehouseControllers.js";

const router = express.Router();

// Create a new warehouse
router.post("/", createWarehouse);

// Get all warehouses
router.get("/", getAllWarehouses);

// Get a warehouse by ID
router.get("/:id", getWarehouseById);

// Update a warehouse
router.put("/:id", updateWarehouse);

// Delete a warehouse
router.delete("/:id", deleteWarehouse);

export default router;
