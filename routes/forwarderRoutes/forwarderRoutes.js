import express from "express";
import { createForwarder, deleteForwarder, getAllForwarders, getForwarderById, updateForwarder } from "../../controllers/forwaderControllers/forwaderControllers.js";
const router = express.Router();

router.get("/", getAllForwarders);
router.get("/:id", getForwarderById);
router.post("/", createForwarder);
router.put("/:id", updateForwarder);
router.delete("/:id", deleteForwarder);

export default router;
