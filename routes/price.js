import express from "express";
import { updateLocalPricePercentage } from "../controllers/price.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.patch("/",verifyJWT, updateLocalPricePercentage);
router.post("/",verifyJWT, updateLocalPricePercentage);

export default router;
