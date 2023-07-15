import ShippingAgent from "../../models/ShippingAgent/ShippingAgent.js";

// Create a new shipping agent
const createShippingAgent = async (req, res) => {
  try {
    const { name, image, contact, address, services, operatingHours, notes, website } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const duplicate = await ShippingAgent.findOne({ name: name }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate shipping agent" });
    }

    const shippingAgent = new ShippingAgent({ name, image, contact, address, services, operatingHours, notes, website });
    await shippingAgent.save();
    res.status(201).json(shippingAgent);
  } catch (error) {
    console.error("Error creating shipping agent:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Error creating shipping agent" });
  }
};

// Get all shipping agents
const getAllShippingAgents = async (req, res) => {
  try {
    const shippingAgents = await ShippingAgent.find();
    res.json(shippingAgents);
  } catch (error) {
    console.error("Error retrieving shipping agents:", error);

    if (error.name === "MongoError" && error.code === 18) {
      return res.status(500).json({ message: "MongoDB connection error" });
    }

    res.status(500).json({ message: "Error retrieving shipping agents" });
  }
};

// Get a shipping agent by ID
const getShippingAgentById = async (req, res) => {
  try {
    const shippingAgent = await ShippingAgent.findById(req.params.id);
    if (!shippingAgent) {
      return res.status(404).json({ error: "Shipping agent not found" });
    }
    res.json(shippingAgent);
  } catch (error) {
    console.error("Error retrieving shipping agent:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid shipping agent ID" });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Shipping agent not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update a shipping agent
const updateShippingAgent = async (req, res) => {
  try {
    const { name, contact, address, services, operatingHours, notes, website, image } = req.body;
    const updateData = {};

    if (name) {
      updateData.name = name;
    }
    if (contact) {
      updateData.contact = contact;
    }
    if (address) {
      updateData.address = address;
    }
    if (services) updateData.services = services;
    if (operatingHours) updateData.operatingHours = operatingHours;
    if (notes) updateData.notes = notes;
    if (website) updateData.website = website;
    if (image) updateData.image = image;

    const shippingAgent = await ShippingAgent.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!shippingAgent) {
      return res.status(404).json({ error: "Shipping agent not found" });
    }
    await shippingAgent.save();
    res.json(shippingAgent);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Shipping agent not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a shipping agent
const deleteShippingAgent = async (req, res) => {
  try {
    const shippingAgent = await ShippingAgent.findByIdAndDelete(req.params.id);
    if (!shippingAgent) {
      return res.status(404).json({ error: "Shipping agent not found" });
    }
    res.json({ message: "Shipping agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipping agent:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid shipping agent ID" });
    }
    res.status(500).json({ message: "Error deleting shipping agent" });
  }
};

export { createShippingAgent, getAllShippingAgents, getShippingAgentById, updateShippingAgent, deleteShippingAgent };
