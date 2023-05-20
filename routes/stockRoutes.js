import express from "express";
import { addStockItem, bookPiProducts, getStock } from "../controllers/stockControllers/stockControllers.js";
const router = express.Router();
router.post("/:id", addStockItem);
router.patch("/book/:id", bookPiProducts);
router.get("/", getStock);
/*
router.post("/stock/:id", updateProductStock);
router.patch("/stockall/:id", updateStock);
router.patch("/productqty/:id", updateProductWarehouseBlQty);
router.patch("/productbookedqty/:id", updateProductWarehouseBlBookedQty);
router.patch("/productmoveavailable/:id", updateProductMoveToAvailable);
router.patch("/productmovecoming/:id", updateProductMoveToComing);
router.patch("/bookpiproducts/:id", bookPiProducts);
router.patch("/unbookpiproducts/:id", unbookPiProducts);
*/
export default router;
