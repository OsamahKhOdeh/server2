import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import ProformaInvoice from "../models/proformaInvoice.js";
import SignedPiPDF from "../models/pdfSchema.js";
import { orderStatus } from "../config/piStatus.js";
import payment from "../models/payment..js";

const router = express.Router();

export const addPayment = async (req, res) => {
  const name = req.file.originalname;
  const data = req.file.buffer;
  const contentType = req.file.mimetype;
  const paymentData = JSON.parse(req.body.paymentData);
  const piId = paymentData.piId;

  // console.log(name ,  paymentData);
  const newPayment = new payment({
    name: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
    piId: paymentData.piId,
    piNo: paymentData.piNo,
    customer: paymentData.customer,
    amount: paymentData.amount,
    employee: paymentData.employee,
    invoiceNo: paymentData.invoiceNo,
  });

  newPayment.save(async (err, newPayment) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading PDF file");
    } else {
      console.log(newPayment);
      const pi = await SignedPiPDF.findOne(
        { pi_id: piId },
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
          piId: 1,
        }
      ).sort({ createdAt: -1 });
      console.log(pi.pi_id, pi.payments);
      pi.payments.push(newPayment._id);
      pi.save((error, pi) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error adding payment to pi");
        } else {
          res.status(200).send(`Added payment to${pi.pi}`);
          //res.json({ message: `${pi.pi_id} have this payments ${pi.payments}` })
          console.log("payment added successfully");
        }
      });
    }
  });
};

export const getAllPayments = async (req, res) => {
  try {
    //const total = await Product.countDocuments({});
    const payments = await payment
      .find(
        {},
        {
          invoiceNo: 1,
          piId: 1,
          amount: 1,
          date: 1,
          employee: 1,
          customer: 1,
          createdAt: 1,
          updatedAt: 1,
          piId: 1,
        }
      )
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPiPayments = async (req, res) => {
  const piId = req.params.id;
  try {
    console.log(piId);
    const piPayments = await payment
      .find(
        { piId: piId },
        {
          invoiceNo: 1,
          piId: 1,
          amount: 1,
          date: 1,
          employee: 1,
          customer: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      )
      .sort({ createdAt: 1 });

    res.json(piPayments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const downloadPayment = async (req, res) => {
  const paymentId = req.params.id;
  payment.findOne({ _id: paymentId }, (err, pdf) => {
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

export default router;
