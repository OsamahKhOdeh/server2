import express from "express";
import { getAll, getByEmployee, updateStatus } from "../../controllers/proccessControllers.js";
const router = express.Router();

router.get("/", getAll);
router.get("/:employee_name", getByEmployee);

router.patch("/:id", updateStatus);

export default router;
