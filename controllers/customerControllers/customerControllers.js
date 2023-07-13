import Customer from "../../models/Customer/Customer.js";

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, contact, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const duplicate = await Customer.findOne({ name: name });
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate customer" });
    }
    const customer = new Customer({ name, contact, address });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating supplier:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Error creating supplier" });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error("Error retrieving customers:", error);

    if (error.name === "MongoError" && error.code === 18) {
      return res.status(500).json({ message: "MongoDB connection error" });
    }

    res.status(500).json({ message: "Error retrieving customers" });
  }
};

// Get a customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error retrieving customer:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updateData = {};

    if (name) {
      updateData.name = name;
    }
    if (email) {
      updateData.email = email;
    }
    if (phone) {
      updateData.phone = phone;
    }
    if (address) {
      updateData.address = address;
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    await customer.save();
    res.json(customer);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting cutomer:", error);
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    res.status(500).json({ message: "Error deleting customer" });
  }
};

export { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
