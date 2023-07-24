import express from "express";
import {
  createPackingList,
  deletePackingList,
  getAllPackingLists,
  getEmployeePackingLists,
  getPackingListInfo,
  getPackingListInfoManual,
  updatePackingList,
  updatePackingListStatus,
} from "../../controllers/packingListControllers/packingListControllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";

const router = express.Router();
//router.use(verifyJWT)

router.get("/info/:id", getPackingListInfo);
router.get("/infomanual/:id", getPackingListInfoManual);

router.post("/", createPackingList);
router.put("/:id", updatePackingList);
router.get("/", getAllPackingLists);
router.get("/employee", getEmployeePackingLists);
router.patch("/:id", updatePackingListStatus);
router.delete("/:id", deletePackingList);

export default router;
