import express from "express";
import {
  createPackingList,
  deletePackingList,
  getAllPackingLists,
  getEmployeePackingLists,
  getPackingListInfo,
  getPackingListInfoManual,
  updatePackingListStatus,
} from "../../controllers/packingListControllers/packingListControllers.js";

const router = express.Router();

router.get("/info/:id", getPackingListInfo);
router.get("/infomanual/:id", getPackingListInfoManual);

router.post("/", createPackingList);
router.get("/", getAllPackingLists);
router.get("/employee", getEmployeePackingLists);
router.patch("/:id", updatePackingListStatus);
router.delete("/:id", deletePackingList);

export default router;
