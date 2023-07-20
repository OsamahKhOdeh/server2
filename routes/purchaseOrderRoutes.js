import express from "express";

import verifyJWT from "../middleware/verifyJWT.js";
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getAll,
  getEmployeePOs,
  getPurchaseOrderById,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
} from "../controllers/purchaseOrderControllers/purchaseOrderControllers.js";
import { assignBlForwarder, updateETFP, updateFileInfo } from "../controllers/purchaseOrderControllers/afterPiControllers.js";

const router = express.Router();

//router.use(verifyJWT);
router.post("/", createPurchaseOrder);
router.delete("/:id", deletePurchaseOrder);
router.get("/", getAll);
router.get("/id/:id", getPurchaseOrderById);
router.get("/employee", getEmployeePOs);
router.put("/etfp/:id", updateETFP);
router.patch("/:id", updatePurchaseOrderStatus), router.patch("/update/:id", updatePurchaseOrder);
router.put("/info/:id", updateFileInfo);
router.put("/assign-forwarder/:id", assignBlForwarder);

updatePurchaseOrderStatus;

/*
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
*/
export default router;
