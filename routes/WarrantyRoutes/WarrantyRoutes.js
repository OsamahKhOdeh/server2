import express from "express";

import { addSerialNumber, checkSerialNumber } from "../../controllers/WarrantyControllers/WarrantyControllers.js";

const router = express.Router();

router.post("/", checkSerialNumber);
router.post("/new", addSerialNumber);

export default router;
