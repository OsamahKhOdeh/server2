import express from "express";
import {
  addBuyer,
  addConsignee,
  addFinalDestination,
  addIncoterm,
  addNotifyParty,
  addPortOfOrigin,
  addSupplier,
  createPoInfo,
  getPoInfo,
} from "../controllers/poInfoController.js";

const router = express.Router();

router.get("/", getPoInfo);
router.post("/", createPoInfo);
router.patch("/supplier", addSupplier);
router.patch("/buyer", addBuyer);
router.patch("/consignee", addConsignee);
router.patch("/notifyparty", addNotifyParty);
router.patch("/portoforigin", addPortOfOrigin);
router.patch("/finaldestination", addFinalDestination);
router.patch("/incoterm", addIncoterm);

export default router;

/*
 supplier: [{ type: String }],
    buyer: [{ type: String }],
    consignee: [{ type: String }],
    notifyParty: [{ type: String }],
    portOfOrigin: [{ type: String }],
    finalDestination: [{ type: String }],
    incoterms: [{ type: String }],*/
