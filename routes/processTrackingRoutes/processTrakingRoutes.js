import express from "express";
import { getAll, getByEmployee, updateStatus } from "../../controllers/proccessControllers.js";
import verifyJWT from "../../middleware/verifyJWT.js";
const router = express.Router();
router.use(verifyJWT)

router.get("/", getAll);
router.get("/:employee_name", getByEmployee);

router.patch("/:id", updateStatus);

export default router;
