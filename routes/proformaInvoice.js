import express from "express";
import multer from "multer";
import { createProformaInvoice, getLastPiNo ,getAllPIs , updateProformaInvoiceStatus ,getEmployeePIs ,updateProformaInvoice, uploadSignedProformaInvoice, downloadSignedProformaInvoice } from "../controllers/proformaInvoice.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();


// router.use(verifyJWT)
router.post("/", createProformaInvoice);
router.get("/last", getLastPiNo);
router.get("/",getAllPIs)
router.get("/employee", getEmployeePIs)

router.patch('/:id', updateProformaInvoiceStatus);
router.patch('/update/:id', updateProformaInvoice);


const upload = multer();

router.post('/pisigned',upload.single('pdf') , uploadSignedProformaInvoice);
router.get('/pisigned/:id',downloadSignedProformaInvoice);


export default router;
