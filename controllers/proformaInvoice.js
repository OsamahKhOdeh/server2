import express from "express";
import mongoose from "mongoose";

import ProformaInvoice from "../models/proformaInvoice.js";

const router = express.Router();

export const createProformaInvoice = async (req, res) => {
  console.log(req.body);
  const products = req.body.piProducts;
  const no = req.body.piInfo.invoiceNo;
  const buyer_address = req.body.piInfo.buyerAdress;
  const party_of_discharge = req.body.piInfo.partyOfDischarge;
  const final_distination = req.body.piInfo.finalDistination;
  const employee = req.body.piInfo.employee;
  const phone_number = req.body.piInfo.phoneNumber;
  const note = req.body.piInfo.note;
  const notify_party = req.body.piInfo.notifyParty;
  const terms = req.body.piInfo.terms;
  const location = req.body.piInfo.location;
  const currency = req.body.piInfo.currency;
  const { date, exporter, consignee, discount ,additions } = req.body.piInfo;
  const pi = {notify_party ,terms,  phone_number,location,currency,note, employee , no, exporter, consignee, discount,additions, date, buyer_address, party_of_discharge, final_distination, products };

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


export const getAllPIs = async (req, res) => {
  try {

    //const total = await Product.countDocuments({});
    const proformaInvoices = await ProformaInvoice.find().sort({createdAt : -1 });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getEmployeePIs = async (req, res) => {
  try {
    const employee_name = req.query.employeename;
    //const total = await Product.countDocuments({});
    const proformaInvoices = await ProformaInvoice.find({employee : employee_name}).sort({createdAt : -1 });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




export const updateProformaInvoiceStatus = async (req, res) => {
  console.log("UPDATAEEEE");

  const id = req.params.id;
  const newStatus = req.body.newStatus;
  const managerMessage = req.body.managerMessage;
  console.log("🚀"+ req.body.managerMessage)
  console.log(id);
 
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No ProformaInvoice with id: ${id}`);
 // Does the Proforma exist to update?
 const proforma = await ProformaInvoice.findById(id).exec()
 if (!proforma) {
  return res.status(400).json({ message: 'ProformaInvoice not found' })
}
 proforma.status = newStatus; 
 proforma.managerMessage = managerMessage;
 const updatedProformaInvoice = await proforma.save()

 res.json({ message: `${updatedProformaInvoice._id} updated and set to ${updatedProformaInvoice.status}` })

};

export default router;

