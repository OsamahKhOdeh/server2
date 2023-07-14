import Supplier from "../../models/Supplier/Supplier.js";
/* -------------------------------------------------------------------------- */
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    console.error("Error retrieving suppliers:", error);

    if (error.name === "MongoError" && error.code === 18) {
      return res.status(500).json({ message: "MongoDB connection error" });
    }

    res.status(500).json({ message: "Error retrieving suppliers" });
  }
};

/* -------------------------------------------------------------------------- */
export const getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    console.error("Error retrieving supplier:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    res.status(500).json({ message: "Error retrieving supplier" });
  }
};

/* -------------------------------------------------------------------------- */
export const createSupplier = async (req, res) => {
  const {
    supplierName,
    address,
    city,
    country,
    postalCode,
    contactPerson,
    contactEmail,
    contactPhone,
    website,
    taxID,
    paymentTerms,
    productCategories,
    bankAccount,
    logo,
    notes,
    communicationMethod,
    cashBackTerms,
  } = req.body;

  try {
    if (!supplierName || !country || !contactPerson || !contactEmail || !contactPhone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const duplicate = await Supplier.findOne({ supplierName: supplierName }).lean().exec();
    console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    console.log(duplicate);
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate supplier" });
    }
    const newSupplier = await Supplier.create({
      supplierName,
      address,
      city,
      country,
      postalCode,
      contactPerson,
      contactEmail,
      contactPhone,
      website,
      taxID,
      paymentTerms,
      productCategories,
      bankAccount,
      logo,
      notes,
      communicationMethod,
      cashBackTerms,
    });

    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Error creating supplier" });
  }
};

/* -------------------------------------------------------------------------- */
export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const {
    supplierName,
    address,
    city,
    country,
    postalCode,
    contactPerson,
    contactEmail,
    contactPhone,
    website,
    taxID,
    paymentTerms,
    productCategories,
    bankAccount,
    logo,
    notes,
    communicationMethod,
    cashBackTerms,
  } = req.body;

  try {
    const updatedFields = {};
    if (supplierName) updatedFields.supplierName = supplierName;
    if (address) updatedFields.address = address;
    if (city) updatedFields.city = city;
    if (country) updatedFields.country = country;
    if (postalCode) updatedFields.postalCode = postalCode;
    if (contactPerson) updatedFields.contactPerson = contactPerson;
    if (contactEmail) updatedFields.contactEmail = contactEmail;
    if (contactPhone) updatedFields.contactPhone = contactPhone;
    if (website) updatedFields.website = website;
    if (taxID) updatedFields.taxID = taxID;
    if (paymentTerms) updatedFields.paymentTerms = paymentTerms;
    if (productCategories) updatedFields.productCategories = productCategories;
    if (bankAccount) updatedFields.bankAccount = bankAccount;
    if (logo) updatedFields.logo = logo;
    if (notes) updatedFields.notes = notes;
    if (cashBackTerms) updatedFields.cashBackTerms = cashBackTerms;
    if (communicationMethod) updatedFields.communicationMethod = communicationMethod;

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Error updating supplier" });
  }
};

/* -------------------------------------------------------------------------- */
export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid supplier ID" });
    }

    res.status(500).json({ message: "Error deleting supplier" });
  }
};

/* -------------------------------------------------------------------------- */
