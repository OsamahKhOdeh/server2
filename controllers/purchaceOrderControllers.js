import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import ProformaInvoice from "../models/proformaInvoice.js";
import SignedPiPDF from "../models/pdfSchema.js";
import { orderStatus } from "../config/piStatus.js";
import PurchaseOrder from "../models/PurchaseOrder.js";
import { moneyToEng } from "../helpers/usefulFunctions.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

export const createPurchaseOrder = async (req, res) => {
  const {
    no,
    exporter,
    notifyParty,
    buyerAddress,
    consignee,
    portOfOrigin,
    portOfDischarge,
    products,
    employee,
    managerMessage,
    currency,
    note,
    incoterms,
    manager,
    discount,
    date,
    status,
  } = req.body;

  products.map((product) => {
    product.totalWeight = product?.grossWeight * product.qty || 0;
    product.totalAmount = product.price * product.qty;
  });

  let subTotalAmount = 0;
  let totalWeight = 0;
  let totalPallets = 0;
  let totalPcs = 0;

  products.map((product) => {
    subTotalAmount += product.totalAmount;
    totalWeight += product?.totalWeight || 0;
    totalPallets += product.palletQty || 0;
    totalPcs += product.qty;
  });

  subTotalAmount = subTotalAmount?.toFixed(2);

  let totalAmount = 0;
  if (discount > 0) {
    totalAmount = (subTotalAmount - subTotalAmount * (discount / 100)).toFixed(2);
  } else {
    totalAmount = subTotalAmount;
  }
  //let

  let totalAmountInWords = moneyToEng(totalAmount, currency);

  if (!totalWeight) totalWeight = 0;

  const newPurchaseOrder = new PurchaseOrder({
    no,
    exporter,
    notifyParty,
    buyerAddress,
    consignee,
    portOfOrigin,
    portOfDischarge,
    products,
    employee,
    managerMessage,
    currency,
    note,
    incoterms,
    manager,
    discount,
    date,
    status,
    subTotalAmount,
    totalAmount,
    totalPallets,
    totalPcs,
    totalWeight,
    totalAmountInWords,
  });
  try {
    await newPurchaseOrder.save();
    console.log("saved...................");
    res.status(201).json(newPurchaseOrder);
  } catch (error) {
    console.log("not saved...................");
    res.status(409).json({ message: error });
  }
};

export const getAll = async (req, res) => {
  try {
    //const total = await Product.countDocuments({});
    const purchaseOrders = await PurchaseOrder.find().sort({
      updatedAt: -1,
    });

    res.json(purchaseOrders);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Delete a PO
// @route DELETE /po
// @access Private
export const deletePurchaseOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: " ID Required" });
  }

  // Does the user exist to delete?
  const po = await PurchaseOrder.findById(id).exec();

  if (!po) {
    return res.status(400).json({ message: "PO not found" });
  }

  const result = await po.deleteOne();

  const reply = `Po ${result} with ID ${result._id} deleted`;

  res.json(reply);
});

export const getEmployeePOs = async (req, res) => {
  try {
    const employee_name = req.query.employeename;
    const purchaseOrders = await PurchaseOrder.find({
      employee: employee_name,
    }).sort({ createdAt: -1 });

    res.json(purchaseOrders);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No po with id: ${id}`);

  const updatedPurchaseOrder = req.body;
  const returnedUpdatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(id, updatedPurchaseOrder, {
    new: true,
  });

  res.json(returnedUpdatedPurchaseOrder);
};

export const updatePurchaseOrderStatus = async (req, res) => {
  console.log("UPDATAEEEE");

  const id = req.params.id;
  const newStatus = req.body.newStatus;
  const managerMessage = req.body.managerMessage;
  const manager = req.body.manager;
  console.log("🚀" + req.body.managerMessage);
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No PurchaseOrder with id: ${id}`);
  const po = await PurchaseOrder.findById(id).exec();
  if (!po) {
    return res.status(400).json({ message: "PurchaseOrder not found" });
  }
  po.status = newStatus;
  if (managerMessage) po.managerMessage = managerMessage;
  if (manager) po.manager = manager;
  const updatedPo = await po.save();

  res.json({
    message: `${updatedPo._id} updated and set to ${updatedPo.status}`,
  });
};

export default router;
