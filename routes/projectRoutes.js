import express from "express";

import { addTask, createProject, getEmployeeProjects, getProjects } from "../controllers/projectControllers.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();
//router.use(verifyJWT)

router.get("/", getProjects);
router.get("/employee/:employeename", getEmployeeProjects);
router.post("/", createProject);
router.patch("/:id", addTask);

export default router;
