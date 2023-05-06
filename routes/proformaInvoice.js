import express from "express";
import multer from "multer";
import {
  createProformaInvoice,
  getLastPiNo,
  getAllPIs,
  updateProformaInvoiceStatus,
  getEmployeePIs,
  updateProformaInvoice,
  uploadSignedProformaInvoice,
  downloadSignedProformaInvoice,
  getAllSignedPIs,
  getEmployeeSignedPIs,
  updateSignedProformaInvoiceStatus,
  clear,
  deleteProformaInvoice,
} from "../controllers/proformaInvoice.js";
import verifyJWT from "../middleware/verifyJWT.js";
import { addPayment, getAllPayments, getPiPayments, downloadPayment } from "../controllers/payments.js";

const router = express.Router();

// router.use(verifyJWT)
router.post("/", createProformaInvoice);
router.delete("/:id", deleteProformaInvoice);
router.get("/last", getLastPiNo);
router.get("/", getAllPIs);
router.get("/employee", getEmployeePIs);

router.patch("/:id", updateProformaInvoiceStatus);
router.patch("/update/:id", updateProformaInvoice);

const upload = multer();

router.post("/pisigned", upload.single("pdf"), uploadSignedProformaInvoice);
router.get("/pisigned/:id", downloadSignedProformaInvoice);
router.get("/pisigned", getAllSignedPIs);
router.get("/pisigned/employee/:employeename", getEmployeeSignedPIs);
router.patch("/pisigned/:id", updateSignedProformaInvoiceStatus);
router.get("/pisignedclear", clear);

router.post("/payment", upload.single("pdf"), addPayment);
router.get("/payment", getAllPayments);
router.get("/payment/:id", getPiPayments);
router.get("/downloadpayment/:id", downloadPayment);
export default router;
