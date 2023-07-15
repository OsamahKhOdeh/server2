import express from "express";
import {
  deleteClearanceAgent,
  createClearanceAgent,
  getAllClearanceAgents,
  getClearanceAgentById,
  updateClearanceAgent,
} from "../../controllers/clearanceAgentControllers/clearanceAgentControllers.js";

const router = express.Router();

// Create a new clearance agent
router.post("/", createClearanceAgent);

// Get all clearance agents
router.get("/", getAllClearanceAgents);

// Get a clearance agent by ID
router.get("/:id", getClearanceAgentById);

// Update a clearance agent
router.put("/:id", updateClearanceAgent);

// Delete a clearance agent
router.delete("/:id", deleteClearanceAgent);

export default router;
