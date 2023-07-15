import express from "express";
import {
  deleteShippingAgent,
  createShippingAgent,
  getAllShippingAgents,
  getShippingAgentById,
  updateShippingAgent,
} from "../../controllers/shippingAgentControllers.js/shippingAgentControllers.js";

const router = express.Router();

// Create a new shipping agent
router.post("/", createShippingAgent);

// Get all shipping agents
router.get("/", getAllShippingAgents);

// Get a shipping agent by ID
router.get("/:id", getShippingAgentById);

// Update a shipping agent
router.put("/:id", updateShippingAgent);

// Delete a shipping agent
router.delete("/:id", deleteShippingAgent);

export default router;
