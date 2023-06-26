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
import {
  createProformaInvoiceSyria,
  deleteProformaInvoiceSyria,
  getAllPIsSyria,
  getEmployeePIsSyria,
  getLastPiNoSyria,
  updateProformaInvoiceStatusSyria,
  updateProformaInvoiceSyria,
} from "../controllers/proformaInvoiceSyria.js";

const router = express.Router();

// router.use(verifyJWT)
/* ---------------------------------- SYRAI --------------------------------- */
router.post("/syria", createProformaInvoiceSyria);
router.delete("/syria/:id", deleteProformaInvoiceSyria);
router.get("/syria/last", getLastPiNoSyria);
router.get("/syria", getAllPIsSyria);
router.get("/syria/employee", getEmployeePIsSyria);
router.patch("/syria/:id", updateProformaInvoiceStatusSyria);
router.patch("/update/syria/:id", updateProformaInvoiceSyria);
/* -------------------------------------------------------------------------- */

router.post("/", verifyJWT, createProformaInvoice);
router.delete("/:id", verifyJWT, deleteProformaInvoice);
router.get("/last", getLastPiNo);
router.get("/", getAllPIs);
router.get("/employee", verifyJWT, getEmployeePIs);

router.patch("/:id", verifyJWT, updateProformaInvoiceStatus);
router.patch("/update/:id", verifyJWT, updateProformaInvoice);

const upload = multer();

router.post("/pisigned", verifyJWT, upload.single("pdf"), uploadSignedProformaInvoice);
router.get("/pisigned/:id", verifyJWT, downloadSignedProformaInvoice);
router.get("/pisigned", verifyJWT, getAllSignedPIs);
router.get("/pisigned/employee/:employeename", verifyJWT, getEmployeeSignedPIs);
router.patch("/pisigned/:id", verifyJWT, updateSignedProformaInvoiceStatus);
router.get("/pisignedclear", verifyJWT, clear);

router.post("/payment", verifyJWT, upload.single("pdf"), addPayment);
router.get("/payment", verifyJWT, getAllPayments);
router.get("/payment/:id", verifyJWT, getPiPayments);
router.get("/downloadpayment/:id", verifyJWT, downloadPayment);
export default router;
