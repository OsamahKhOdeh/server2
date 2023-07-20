import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import asyncHandler from "express-async-handler";

import ProformaInvoice from "../models/proformaInvoice.js";
import SignedPiPDF from "../models/pdfSchema.js";
import { orderStatus } from "../config/piStatus.js";
import { processStatusesEnum } from "../config/processStatus.js";

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
  const deliveryDate = req.body.piInfo.deliveryDate;
  const documentCharges = req.body.piInfo.documentCharges;
  const additionsDescription = req.body.piInfo.additionsDescription;
  const discountDescription = req.body.piInfo.discountDescription;

  console.log("🚀 ~ file: proformaInvoice.js:23 ~ createProformaInvoice ~ bankDetails:", bankDetails);

  const { date, exporter, consignee, discount, additions } = req.body.piInfo;
  const pi = {
    notify_party,
    terms,
    phone_number,
    bankDetails,
    location,
    currency,
    note,
    employee,
    no,
    exporter,
    paymentPercentage,
    deliveryDate,
    documentCharges,
    consignee,
    discount,
    discountDescription,
    additions,
    additionsDescription,
    date,
    buyer_address,
    party_of_discharge,
    final_distination,

    products,
    processStatus: [
      {
        status: processStatusesEnum.STARTED,
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
        notes: [],
      },
    ],
  };

  const newProformaInvoice = new ProformaInvoice(pi);

  try {
    await newProformaInvoice.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).json(newProformaInvoice);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// @desc Delete a PI
// @route DELETE /pi
// @access Private
export const deleteProformaInvoice = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: " ID Required" });
  }

  // Does the user exist to delete?
  const pi = await ProformaInvoice.findById(id).exec();

  if (!pi) {
    return res.status(400).json({ message: "PI not found" });
  }

  const result = await pi.deleteOne();

  const reply = `Pi ${result} with ID ${result._id} deleted`;

  res.json(reply);
});

export const getLastPiNo = async (req, res) => {
  try {
    const lastNo = await ProformaInvoice.find({}, "exporter pi_no").sort({ pi_no: -1 }).limit(1);
    let no = lastNo[0].pi_no;
    res.status(201).json(no);
    console.log(lastNo);
  } catch (e) {
    res.status(404).json({ error: e });
  }
};

export const getAllPIs = async (req, res) => {
  try {
    // await ProformaInvoice.updateMany({}, { $set: { branch: "DUBAI" } });
    const proformaInvoices = await ProformaInvoice.find({ $or: [{ branch: "DUBAI" }, { branch: "SYRIA", status: "Approved" }] }).sort({
      pi_no: -1,
    });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEmployeePIs = async (req, res) => {
  try {
    const employee_name = req.query.employeename;
    console.log(employee_name);
    const proformaInvoices = await ProformaInvoice.find({
      employee: employee_name,
    }).sort({ createdAt: -1 });

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
  const finance = req.body.finance;
  const financeMessage = req.body.financeMessage;

  const managerApproval = req.body.managerApproval;
  const financiaApproval = req.body.financiaApproval;

  console.log("🚀" + finance, financiaApproval, financeMessage);
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No ProformaInvoice with id: ${id}`);
  // Does the Proforma exist to update?
  const proforma = await ProformaInvoice.findById(id).exec();
  if (!proforma) {
    return res.status(400).json({ message: "ProformaInvoice not found" });
  }
  proforma.status = newStatus;
  if (managerMessage) proforma.managerMessage = managerMessage;
  if (manager) proforma.manager = manager;
  if (managerApproval !== undefined) proforma.managerApproval = managerApproval;
  if (financiaApproval !== undefined) proforma.financiaApproval = financiaApproval;
  if (financeMessage) {
    proforma.financeMessage = financeMessage;
  }
  if (finance) {
    proforma.finance = finance;
  }

  const updatedProformaInvoice = await proforma.save();
  if (proforma.managerApproval === "Approved") {
    let index = proforma.processStatus.findIndex((status) => status.status === processStatusesEnum.APPROVED_BY_SALES_MANAGER);
    console.log(index);
    if (index === -1) {
      proforma.processStatus.push({
        status: processStatusesEnum.APPROVED_BY_SALES_MANAGER,
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
        notes: [],
      });
    }
  } else if (proforma.managerApproval === "Rejected") {
  }
  if (proforma.financiaApproval === "Approved") {
    let index = proforma.processStatus.findIndex((status) => status.status === processStatusesEnum.APPROVED_BY_FINANCE);
    if (index === -1) {
      proforma.processStatus.push({
        status: processStatusesEnum.APPROVED_BY_FINANCE,
        startTime: new Date(),
        endTime: new Date(),
        duration: 0,
        notes: [],
      });
    }
  } else if (proforma.financiaApproval === "Rejected") {
  }
  const savedProforma = await proforma.save();
  res.json(savedProforma);
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

  const returnedUpdatedProformaInvoice = await ProformaInvoice.findByIdAndUpdate(id, updatedProformaInvoice, {
    new: true,
  });

  res.json(returnedUpdatedProformaInvoice);
};

export const uploadSignedProformaInvoice = async (req, res) => {
  console.log(req.file);

  const piFileInfo = req.file.originalname.split("_");
  const pi_no = piFileInfo[1];
  const employee = piFileInfo[2];
  const manager = piFileInfo[3];
  const pi_id = piFileInfo[4];
  const buyer_address = piFileInfo[5];
  console.log(pi_no, employee, manager, pi_id);
  const pdf = new SignedPiPDF({
    name: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
    pi_id,
    pi_no,
    manager,
    employee,
    buyer_address,
  });
  pdf.save(async (err, pdf) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading PDF file");
    } else {
      const proforma = await ProformaInvoice.findById(pi_id).exec();
      if (!proforma) {
        return res.status(400).json({ message: "ProformaInvoice not found" });
      }
      proforma.status = "Signed";
      const updatedProformaInvoice = await proforma.save();
      res.send("PDF file uploaded successfully");
    }
  });
};

export const downloadSignedProformaInvoice = async (req, res) => {
  SignedPiPDF.findOne({ pi_id: req.params.id }, (err, pdf) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error finding PDF file");
    } else {
      res.setHeader("Content-Type", pdf.contentType);
      res.setHeader("Content-Disposition", "attachment; filename=" + pdf.name);
      res.send(pdf.data);
    }
  });
};

export const getAllSignedPIs = async (req, res) => {
  console.log("🚀 ~ file: proformaInvoice.js:177 ~ getAllSignedPIs ~ getAllSignedPIs:", "getAllSignedPIs");

  try {
    //const total = await Product.countDocuments({});
    const proformaInvoices = await SignedPiPDF.find(
      {},
      {
        pi_id: 1,
        pi_no: 1,
        employee: 1,
        manager: 1,
        date: 1,
        name: 1,
        status: 1,
        pi_done_status: 1,
        buyer_address: 1,
        createdAt: 1,
        updatedAt: 1,
        payments: 1,
        booked: 1,
      }
    ).sort({ createdAt: -1 });
    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEmployeeSignedPIs = async (req, res) => {
  const employee_name = req.params.employeename;
  try {
    console.log(employee_name);
    const proformaInvoices = await SignedPiPDF.find(
      { employee: employee_name },
      {
        pi_id: 1,
        pi_no: 1,
        employee: 1,
        manager: 1,
        date: 1,
        name: 1,
        status: 1,
        pi_done_status: 1,
        buyer_address: 1,
        createdAt: 1,
        updatedAt: 1,
        booked: 1,
      }
    ).sort({ createdAt: -1 });

    res.json(proformaInvoices);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateSignedProformaInvoiceStatus = async (req, res) => {
  console.log("");
  const status = req.body.status;
  const id = req.params.id;
  console.log(id, status);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No ProformaInvoice with id: ${id}`);
  // Does the Proforma exist to update?
  const proforma = await SignedPiPDF.findOne({ pi_id: id }).exec();
  if (!proforma) {
    return res.status(400).json({ message: "ProformaInvoice not found" });
  }

  console.log(proforma.status);
  const current_stage_no = orderStatus.filter((item) => item.status === proforma.status)[0].stage_no;
  console.log(current_stage_no);
  const nextStage = orderStatus.filter((status) => status.stage_no === current_stage_no + 1)[0].status;
  console.log(nextStage);
  proforma.status = nextStage;
  proforma.pi_done_status.push(nextStage);
  if (status) {
    proforma.status = status;
    proforma.pi_done_status.push(status);
  }
  const updatedProformaInvoice = await proforma.save();

  res.json({
    message: `${updatedProformaInvoice._id} updated and set to ${updatedProformaInvoice.status}`,
  });
};

export const clear = async (req, res) => {
  try {
    const proformaInvoices = await SignedPiPDF.updateMany({}, { $set: { status: "CONFIRMED", pi_done_status: ["CONFIRMED"] } }, { upsert: false });

    res.json("proformaInvoices");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
