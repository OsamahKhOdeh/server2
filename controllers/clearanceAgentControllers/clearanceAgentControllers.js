import ClearanceAgent from "../../models/ClearanceAgent/ClearanceAgent.js";

// Create a new clearance agent
const createClearanceAgent = async (req, res) => {
  try {
    const { name, image, contact, address, services, operatingHours, notes, website } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const duplicate = await ClearanceAgent.findOne({ name: name }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate clearance agent" });
    }

    const clearanceAgent = new ClearanceAgent({ name, image, contact, address, services, operatingHours, notes, website });
    await clearanceAgent.save();
    res.status(201).json(clearanceAgent);
  } catch (error) {
    console.error("Error creating clearance agent:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Error creating clearance agent" });
  }
};

// Get all clearance agents
const getAllClearanceAgents = async (req, res) => {
  try {
    const clearanceAgents = await ClearanceAgent.find();
    res.json(clearanceAgents);
  } catch (error) {
    console.error("Error retrieving clearance agents:", error);

    if (error.name === "MongoError" && error.code === 18) {
      return res.status(500).json({ message: "MongoDB connection error" });
    }

    res.status(500).json({ message: "Error retrieving clearance agents" });
  }
};

// Get a clearance agent by ID
const getClearanceAgentById = async (req, res) => {
  try {
    const clearanceAgent = await ClearanceAgent.findById(req.params.id);
    if (!clearanceAgent) {
      return res.status(404).json({ error: "Clearance agent not found" });
    }
    res.json(clearanceAgent);
  } catch (error) {
    console.error("Error retrieving clearance agent:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid clearance agent ID" });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Clearance agent not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update a clearance agent
const updateClearanceAgent = async (req, res) => {
  try {
    const { name, image, contact, address, balance, services, active, operatingHours, notes, website } = req.body;
    const updateData = {};

    if (name) {
      updateData.name = name;
    }
    if (image) {
      updateData.image = image;
    }
    if (contact) {
      updateData.contact = contact;
    }
    if (address) {
      updateData.address = address;
    }
    if (balance) {
      updateData.balance = balance;
    }
    if (services) {
      updateData.services = services;
    }
    if (active !== undefined) {
      updateData.active = active;
    }
    if (operatingHours) {
      updateData.operatingHours = operatingHours;
    }
    if (notes) {
      updateData.notes = notes;
    }
    if (website) {
      updateData.website = website;
    }

    const clearanceAgent = await ClearanceAgent.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!clearanceAgent) {
      return res.status(404).json({ error: "Clearance agent not found" });
    }
    await clearanceAgent.save();
    res.json(clearanceAgent);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Clearance agent not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a clearance agent
const deleteClearanceAgent = async (req, res) => {
  try {
    const clearanceAgent = await ClearanceAgent.findByIdAndDelete(req.params.id);
    if (!clearanceAgent) {
      return res.status(404).json({ error: "Clearance agent not found" });
    }
    res.json({ message: "Clearance agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting clearance agent:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid clearance agent ID" });
    }
    res.status(500).json({ message: "Error deleting clearance agent" });
  }
};

export { createClearanceAgent, getAllClearanceAgents, getClearanceAgentById, updateClearanceAgent, deleteClearanceAgent };
