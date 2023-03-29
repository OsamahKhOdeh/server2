import express from "express";
import { createProformaInvoice, getLastPiNo ,getAllPIs , updateProformaInvoiceStatus } from "../controllers/proformaInvoice.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();


// router.use(verifyJWT)
router.post("/", createProformaInvoice);
router.get("/last", getLastPiNo);
router.get("/",getAllPIs)

router.patch('/:id', updateProformaInvoiceStatus);

export default router;
