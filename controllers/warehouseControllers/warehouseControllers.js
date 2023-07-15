import Warehouse from "../../models/Warehouse/Warehouse.js";

// Create a new warehouse
const createWarehouse = async (req, res) => {
  try {
    const { name, image, contact, address, services, operatingHours, notes, website } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const duplicate = await Warehouse.findOne({ name: name }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate warehouse" });
    }

    const warehouse = new Warehouse({ name, image, contact, address, services, operatingHours, notes, website });
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Error creating warehouse" });
  }
};

// Get all warehouses
const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    console.error("Error retrieving warehouses:", error);
    if (error.name === "MongoError" && error.code === 18) {
      return res.status(500).json({ message: "MongoDB connection error" });
    }
    res.status(500).json({ message: "Error retrieving warehouses" });
  }
};

// Get a warehouse by ID
const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.json(warehouse);
  } catch (error) {
    console.error("Error retrieving warehouse:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid warehouse ID" });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update a warehouse
const updateWarehouse = async (req, res) => {
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

    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    await warehouse.save();
    res.json(warehouse);
  } catch (error) {
    console.error("Error updating warehouse:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a warehouse
const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    console.error("Error deleting warehouse:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid warehouse ID" });
    }
    res.status(500).json({ message: "Error deleting warehouse" });
  }
};

export { createWarehouse, getAllWarehouses, getWarehouseById, updateWarehouse, deleteWarehouse };
