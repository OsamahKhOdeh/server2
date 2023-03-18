import express from "express";
import { createProformaInvoice, getLastPiNo } from "../controllers/proformaInvoice.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// router.use(verifyJWT)
router.post("/", createProformaInvoice);
router.get("/last", getLastPiNo);

export default router;
