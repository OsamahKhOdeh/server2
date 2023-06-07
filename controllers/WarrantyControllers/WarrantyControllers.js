import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import SerialNumber from "../../models/SerialNumber/SerialNumber.js";

const router = express.Router();

export const checkSerialNumber = async (req, res) => {
  const { serialnumber } = req.body;
  try {
    console.log(serialnumber);
    const foundSerialNumber = await SerialNumber.findOne({ SN: serialnumber });
    console.log(foundSerialNumber);
    if (foundSerialNumber) {
      res.json("exist");
      return;
    } else {
      res.json("notexist");
      return;
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addSerialNumber = async (req, res) => {
  const { serialnumber } = req.body;

  try {
    const foundSerialNumber = await SerialNumber.create({ SN: serialnumber.toString() });
    if (foundSerialNumber) {
      res.json("exist");
      return;
    } else {
      res.json("notexist");
      return;
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
