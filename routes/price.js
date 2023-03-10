import express from "express";
import { updateLocalPricePercentage } from "../controllers/price.js";
const router = express.Router();

router.patch("/", updateLocalPricePercentage);
router.post("/", updateLocalPricePercentage);

export default router;
