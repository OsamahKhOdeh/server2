import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import asyncHandler from "express-async-handler";

import ProformaInvoice from "../models/proformaInvoice.js";
import { processStatuses } from "../config/processStatus.js";

export const getAll = async (req, res) => {
  try {
    // await ProformaInvoice.updateMany({}, { $set: { processStatus: [{ status: "STARTED" }] } });
    //const total = await Product.countDocuments({});
    const proformaInvoices = await ProformaInvoice.find(
      {},
      {
        processStatus: 1,
        _id: 1,
        pi_no: 1,
        employee: 1,
        buyer_address: 1,
        createdAt: 1,
        updatedAt: 1,
        exporter: 1,
      }
    ).sort({
      pi_no: 1,
    });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getByEmployee = async (req, res) => {
  const employee = req.params.employee_name;
  console.log(employee);

  try {
    const proformaInvoices = await ProformaInvoice.find(
      { employee: employee },
      {
        processStatus: 1,
        _id: 1,
        pi_no: 1,
        employee: 1,
        buyer_address: 1,
        createdAt: 1,
        updatedAt: 1,
        exporter: 1,
      }
    ).sort({
      pi_no: 1,
    });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const piId = req.params.id;
  const action = req.body.action;
  console.log({ id: piId, action: action });

  if (!piId) {
    return res.status(400).json({ message: "PI ID required" });
  }
  const proforma = await ProformaInvoice.findById(piId);
  if (!proforma) {
    return res.status(400).json({ message: "PI not found" });
  }

  const lastStatusIndex = proforma.processStatus.length - 1;
  if (lastStatusIndex >= 0) {
    const lastStatus = proforma.processStatus[lastStatusIndex];
    lastStatus.endTime = new Date();
    lastStatus.duration = lastStatus.endTime - lastStatus.startTime;
  }
  if (action === "next") {
    console.log("NEXT");
    if (proforma.processStatus.length < processStatuses.length) {
      proforma.processStatus.push({
        status: processStatuses[lastStatusIndex + 1],
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
        notes: [],
      });
    } else {
      res.json({ message: "DONE_DEAL already done" });
      return;
    }
  } else if (action === "prev") {
    if (proforma.processStatus.length > 1) {
      proforma.processStatus.pop();
    } else {
      res.json({ message: "STARTED already Set" });
      return;
    }
  } else {
    return res.status(400).json({ message: "Wrong Action" });
  }
  await proforma.save();
  res.json({
    message: `PI ${proforma.pi_no} status changed to ${proforma.processStatus[proforma.processStatus.length - 1].status} Successfully`,
  });
};

const router = express.Router();
