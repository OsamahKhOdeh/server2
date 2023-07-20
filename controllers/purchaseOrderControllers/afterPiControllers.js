import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import PurchaseOrder from "../../models/PurchaseOrder.js";
import Forwarder from "../../models/Forwarder/Forwarder.js";

// Update ETFP for a purchase order
export const updateETFP = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { etfp, notes } = req.body;
  console.log({ etfp, notes });
  try {
    if (!etfp) {
      res.status(400).json({ message: "Invalid etfp value" });
      return;
    }
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      res.status(404).json({ message: "Purchase order not found" });
      return;
    }
    purchaseOrder.ETFP = etfp;
    if (notes) {
      purchaseOrder.caseNotes = notes;
    }
    await purchaseOrder.save();
    res.json({ message: "ETFP updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ETFP", error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
export const updateFileInfo = async (req, res) => {
  const { id } = req.params;
  const { fileType, fileNo, info } = req.body;

  try {
    if (!fileType || !fileNo || !info) {
      res.status(400).json({ message: "Invalid input" });
      return;
    }
    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      res.status(404).json({ message: "Purchase order not found" });
      return;
    }
    const updatedFields = {};
    updatedFields[`${fileType}.info`] = info;
    const updatedDoc = await PurchaseOrder.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
    if (!updatedDoc) {
      res.status(500).json({ message: "Failed to update file information" });
      return;
    }
    res.json({ message: "File information updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update file information", error: error.message });
  }
};

/* -------------------------------------------------------------------------- */
export const assignBlForwarder = async (req, res) => {
  const { id } = req.params;
  const { blNo, forwarderId } = req.body;

  try {
    const forwarder = await Forwarder.findById(forwarderId);
    if (!forwarder) {
      return res.status(404).json({ error: "Forwarder not found" });
    }

    const purchaseOrder = await PurchaseOrder.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    const bl = purchaseOrder.bl.find((bl) => bl.No === blNo);
    if (!bl) {
      return res.status(404).json({ error: "BL not found" });
    }

    bl.blForwarder = {
      forwarderId: forwarder._id,
      forwarderName: forwarder.name,
      blForwarderCostPerContainer: forwarder.costPerContainer,
      blForwarderFreeStorageDuration: forwarder.freeStorageDuration,
      blForwarderAgreementFilePath: "NO//Giles//",
    };

    await purchaseOrder.save();

    return res.status(200).json({ message: "Forwarder assigned to BL successfully", bl });
  } catch (error) {
    console.error("Error assigning forwarder to BL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/* -------------------------------------------------------------------------- */

export const addBlContainer = async (req, res) => {
  const { blNumber, blContainer } = req.params;

  try {
    const purchaseOrder = await PurchaseOrder.findOne({ "bl.No": blNumber });

    if (!purchaseOrder) {
      return res.status(404).json({ error: "Purchase Order not found" });
    }

    const blObject = purchaseOrder.bl.find((bl) => bl.No === blNumber);

    if (!blObject) {
      return res.status(404).json({ error: "BL not found" });
    }

    blObject.blContainers.push(blContainer);

    await purchaseOrder.save();

    return res.status(200).json({ message: "BL Container added successfully", purchaseOrder });
  } catch (error) {
    console.error("Error adding BL Container:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
