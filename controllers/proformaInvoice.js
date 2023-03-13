import express from "express";
import mongoose from "mongoose";

import ProformaInvoice from "../models/proformaInvoice.js";

const router = express.Router();

export const createProformaInvoice = async (req, res) => {
  const products = req.body.piProducts;
  const no = req.body.piInfo.invoiceNo;
  const buyer_address = req.body.piInfo.buyerAdress;
  const party_of_discharge = req.body.piInfo.partyOfDischarge;
  const final_distination = req.body.piInfo.finalDistination;
  const { date, exporter, consignee, discount } = req.body.piInfo;
  const pi = { no, exporter, consignee, discount, date, buyer_address, party_of_discharge, final_distination, products };

  const newProformaInvoice = new ProformaInvoice(pi);

  try {
    await newProformaInvoice.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).json(newProformaInvoice);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getLastPiNo = async (req, res) => {
  try {
    const lastNo = await ProformaInvoice.find({}, "exporter no").sort({ no: -1 }).limit(1);
    let no = lastNo[0].no;
    res.status(201).json(no);
    console.log(lastNo);
  } catch (e) {
    res.status(404).json({ error: e });
  }
};

export default router;
