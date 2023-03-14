import express from "express";
import { createProformaInvoice, getLastPiNo } from "../controllers/proformaInvoice.js";

const router = express.Router();

router.post("/", createProformaInvoice);
router.get("/last", getLastPiNo);

export default router;
