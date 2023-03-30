import express from "express";
import { createProformaInvoice, getLastPiNo ,getAllPIs , updateProformaInvoiceStatus ,getEmployeePIs } from "../controllers/proformaInvoice.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();


// router.use(verifyJWT)
router.post("/", createProformaInvoice);
router.get("/last", getLastPiNo);
router.get("/",getAllPIs)
router.get("/employee", getEmployeePIs)

router.patch('/:id', updateProformaInvoiceStatus);

export default router;
