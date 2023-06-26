import express from "express";

import { addSerialNumber, checkSerialNumber } from "../../controllers/WarrantyControllers/WarrantyControllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";

const router = express.Router();

router.post("/", checkSerialNumber);
router.post("/new",verifyJWT, addSerialNumber);

export default router;
