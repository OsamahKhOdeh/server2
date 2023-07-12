import express from "express";
const router = express.Router();
import { createSupplier, deleteSupplier, getAllSuppliers, getSupplierById, updateSupplier } from "../../controllers/supplierControllers/supplierControllers.js";

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
