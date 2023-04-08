import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import ProformaInvoice from "../models/proformaInvoice.js";
import SignedPiPDF from '../models/pdfSchema.js'

const router = express.Router();

export const createProformaInvoice = async (req, res) => {
  console.log(req.body);
  const products = req.body.piProducts;
  const no = req.body.piInfo.invoiceNo;
  const buyer_address = req.body.piInfo.buyerAdress;
  const party_of_discharge = req.body.piInfo.partyOfDischarge;
  const final_distination = req.body.piInfo.finalDistination;
  const employee = req.body.piInfo.employee;
  const phone_number = req.body.piInfo.employeePhone;
  const note = req.body.piInfo.note;
  const notify_party = req.body.piInfo.notifyParty;
  const terms = req.body.piInfo.terms;
  const location = req.body.piInfo.location;
  const currency = req.body.piInfo.currency;
  const bankDetails = req.body.piInfo.bankDetails;
  const paymentPercentage = req.body.piInfo.paymentPercentage;
  console.log("🚀 ~ file: proformaInvoice.js:23 ~ createProformaInvoice ~ bankDetails:", bankDetails)
  
  const { date, exporter, consignee, discount ,additions } = req.body.piInfo;
  const pi = {notify_party ,terms,  phone_number , bankDetails ,location,currency,note, employee , no, exporter,paymentPercentage ,consignee, discount,additions, date, buyer_address, party_of_discharge, final_distination, products  };

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
    const proformaInvoices = await ProformaInvoice.find().sort({updatedAt : -1 });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getEmployeePIs = async (req, res) => {
  try {
    const employee_name = req.query.employeename;
   console.log(employee_name);
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
  const manager = req.body.manager;
  console.log("🚀"+ req.body.managerMessage)
  console.log(id);
 
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No ProformaInvoice with id: ${id}`);
 // Does the Proforma exist to update?
 const proforma = await ProformaInvoice.findById(id).exec()
 if (!proforma) {
  return res.status(400).json({ message: 'ProformaInvoice not found' })
}
 proforma.status = newStatus;
 if(managerMessage) 
 proforma.managerMessage = managerMessage; 
 if(manager)
 proforma.manager = manager;
 const updatedProformaInvoice = await proforma.save()

 res.json({ message: `${updatedProformaInvoice._id} updated and set to ${updatedProformaInvoice.status}` })

};



export const updateProformaInvoice = async (req, res) => {
  console.log("UPDATAEEEE");

  const id = req.params.id;
  console.log(id);
  console.log(req.query);
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No pi with id: ${id}`);

  const updatedProformaInvoice = req.body;
  // const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  const returnedUpdatedProformaInvoice = await ProformaInvoice.findByIdAndUpdate(id, updatedProformaInvoice, { new: true });

  res.json(returnedUpdatedProformaInvoice);
};




export const uploadSignedProformaInvoice = async (req, res) => {
  console.log(req.file);

  const piFileInfo = req.file.originalname.split('_');
  const pi_no = piFileInfo[1];
  const employee = piFileInfo[2];
  const manager = piFileInfo[3];
  const pi_id = piFileInfo[4];
  const buyer_address = piFileInfo[5];
  console.log(pi_no , employee , manager , pi_id);
  const pdf = new SignedPiPDF({
    name: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
    pi_id,
    pi_no,
    manager,
    employee,
    buyer_address
  });
  pdf.save((err, pdf) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading PDF file');
    } else {
      res.send('PDF file uploaded successfully');
    }
  });
}


export const downloadSignedProformaInvoice = async (req, res) => {
  SignedPiPDF.findOne({ pi_id: req.params.id }, (err, pdf) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error finding PDF file');
    } else {
      res.setHeader('Content-Type', pdf.contentType);
      res.setHeader('Content-Disposition', 'attachment; filename=' + pdf.name);
      res.send(pdf.data);
    }
  });
}



export const getAllSignedPIs = async (req, res) => {
console.log("🚀 ~ file: proformaInvoice.js:177 ~ getAllSignedPIs ~ getAllSignedPIs:", "getAllSignedPIs")

  
  try {

    //const total = await Product.countDocuments({});
    const proformaInvoices = await SignedPiPDF.find({},{pi_id : 1 , pi_no : 1 , pi_employee : 1 , pi_manager : 1 , date : 1 , name : 1 , pi_current_status : 1 , pi_done_status : 1 , buyer_address : 1});
    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};





export const getEmployeeSignedPIs = async (req, res) => {
  const employee_name = req.params.employeename;
  try {
   console.log(employee_name);
    const proformaInvoices = await SignedPiPDF.find({employee : employee_name},{pi_id : 1 , pi_no : 1 , employee : 1 , manager : 1 
      , date : 1 , name : 1 , status : 1 , pi_done_status : 1 , buyer_address : 1 , createdAt : 1 , updatedAt : 1 }).sort({createdAt : -1});

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export default router;

