import Forwarder from "../../models/Forwarder/Forwarder.js";

/* -------------------------------------------------------------------------- */
export const getAllForwarders = async (req, res) => {
  try {
    const forwarders = await Forwarder.find();
    res.json(forwarders);
  } catch (error) {
    console.error("Error retrieving forwarders:", error);

    if (error.name === "MongoError" && error.code === 18) {
      return res.status(500).json({ message: "MongoDB connection error" });
    }

    res.status(500).json({ message: "Error retrieving forwarders" });
  }
};

/* -------------------------------------------------------------------------- */
export const getForwarderById = async (req, res) => {
  const { id } = req.params;
  try {
    const forwarder = await Forwarder.findById(id);
    if (!forwarder) {
      return res.status(404).json({ message: "Forwarder not found" });
    }
    res.json(forwarder);
  } catch (error) {
    console.error("Error retrieving Forwarder:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Forwarder ID" });
    }

    res.status(500).json({ message: "Error retrieving Forwarder" });
  }
};

/* -------------------------------------------------------------------------- */
export const createForwarder = async (req, res) => {
  const {
    forwarderName,
    country,
    contactPerson,
    contactEmail,
    contactPhone,
    website,
    notes,
    communicationMethod,
    etd,
    freeStorageDuration,
    transitTime,
    costPerContainer,
    availableContainerCount,
  } = req.body;
  try {
    if (!forwarderName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const duplicate = await Forwarder.findOne({ forwarderName: forwarderName }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate Forwarder" });
    }
    const newForwader = await Forwarder.create({
      forwarderName,
      country,
      contactPerson,
      contactEmail,
      contactPhone,
      website,
      notes,
      communicationMethod,
      etd,
      freeStorageDuration,
      transitTime,
      costPerContainer,
      availableContainerCount,
    });

    res.status(201).json(newForwader);
  } catch (error) {
    console.error("Error creating forwarder:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Error creating forwarder" });
  }
};

/* -------------------------------------------------------------------------- */
export const updateForwarder = async (req, res) => {
  const { id } = req.params;
  const {
    forwarderName,
    country,
    contactPerson,
    contactEmail,
    contactPhone,
    website,
    notes,
    communicationMethod,
    etd,
    freeStorageDuration,
    transitTime,
    costPerContainer,
    availableContainerCount,
  } = req.body;

  try {
    const updatedFields = {};
    if (forwarderName) updatedFields.forwarderName = forwarderName;
    if (country) updatedFields.country = country;
    if (contactPerson) updatedFields.contactPerson = contactPerson;
    if (contactEmail) updatedFields.contactEmail = contactEmail;
    if (contactPhone) updatedFields.contactPhone = contactPhone;
    if (website) updatedFields.website = website;
    if (notes) updatedFields.notes = notes;
    if (communicationMethod) updatedFields.communicationMethod = communicationMethod;
    if (etd) updatedFields.etd = etd;
    if (freeStorageDuration) updatedFields.freeStorageDuration = freeStorageDuration;
    if (transitTime) updatedFields.transitTime = transitTime;
    if (costPerContainer) updatedFields.costPerContainer = costPerContainer;
    if (availableContainerCount) updatedFields.availableContainerCount = availableContainerCount;

    const updatedForwarder = await Forwarder.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedForwarder) {
      return res.status(404).json({ message: "Forwarder not found" });
    }

    res.json(updatedForwarder);
  } catch (error) {
    console.error("Error updating Forwarder:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }

    res.status(500).json({ message: "Error updating Forwarder" });
  }
};

/* -------------------------------------------------------------------------- */
export const deleteForwarder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedForwarder = await Forwarder.findByIdAndDelete(id);
    if (!deletedForwarder) {
      return res.status(404).json({ message: "Forwarder not found" });
    }
    res.json({ message: "Forwarder deleted successfully" });
  } catch (error) {
    console.error("Error deleting Forwarder:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Forwarder ID" });
    }

    res.status(500).json({ message: "Error deleting Forwarder" });
  }
};

/* -------------------------------------------------------------------------- */
