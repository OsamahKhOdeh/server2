import express from "express";

import { addTask, createProject, getEmployeeProjects, getProjects } from "../controllers/projectControllers.js";

const router = express.Router();
router.get("/", getProjects);
router.get("/employee/:employeename", getEmployeeProjects);
router.post("/", createProject);
router.patch("/:id", addTask);

export default router;
