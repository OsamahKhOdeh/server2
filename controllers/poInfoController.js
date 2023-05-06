import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import POInfo from "../models/POInfo/POInfo.js";

const router = express.Router();

export const createPoInfo = async (req, res) => {
  const poInfo = req.body;
  const newPoInfo = new POInfo(poInfo);
  try {
    await newPoInfo.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).json(newPoInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPoInfo = asyncHandler(async (req, res) => {
  const poInfo = await POInfo.find();
  if (!poInfo?.length) {
    return res.status(400).json({ message: "No info found" });
  }
  res.json(poInfo[0]);
});

export const addSupplier = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const supplier = req.body.supplier;
  if (supplier.length > 5) {
    if (poInfo.supplier.indexOf(supplier) <= -1) {
      poInfo?.supplier?.push(supplier);
    } else {
      res.status(409).json({ message: "supplier already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addConsignee = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const consignee = req.body.consignee;
  if (consignee.length > 5) {
    if (poInfo.consignee.indexOf(consignee) <= -1) {
      poInfo?.consignee?.push(consignee);
    } else {
      res.status(409).json({ message: "consignee already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addBuyer = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const buyer = req.body.buyer;
  if (buyer.length > 1) {
    console.log("kkk");

    if (poInfo.buyer.indexOf(buyer) <= -1) {
      poInfo?.buyer?.push(buyer);
    } else {
      res.status(409).json({ message: "buyer already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addNotifyParty = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const notifyParty = req.body.notifyParty;
  if (notifyParty.length > 5) {
    if (poInfo.notifyParty.indexOf(notifyParty) <= -1) {
      poInfo?.notifyParty?.push(notifyParty);
    } else {
      res.status(409).json({ message: "notifyParty already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addPortOfOrigin = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const portOfOrigin = req.body.portOfOrigin;
  if (portOfOrigin.length > 5) {
    if (poInfo.portOfOrigin.indexOf(portOfOrigin) <= -1) {
      poInfo?.portOfOrigin?.push(portOfOrigin);
    } else {
      res.status(409).json({ message: "portOfOrigin already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addFinalDestination = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const finalDestination = req.body.finalDestination;
  if (finalDestination.length > 5) {
    if (poInfo.finalDestination.indexOf(finalDestination) <= -1) {
      poInfo?.finalDestination?.push(finalDestination);
    } else {
      res.status(409).json({ message: "finalDestination already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addIncoterm = async (req, res) => {
  const poInfoAll = await POInfo.find();
  const poInfo = poInfoAll[0];
  const incoterm = req.body.incoterm;
  if (incoterm.length > 5) {
    if (poInfo.incoterm.indexOf(incoterm) <= -1) {
      poInfo?.incoterm?.push(incoterm);
    } else {
      res.status(409).json({ message: "incoterm already exists" });
    }
  }
  try {
    await poInfo.save();
    res.status(201).json(poInfo);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export default router;
/*
 supplier: [{ type: String }],
    buyer: [{ type: String }],
    consignee: [{ type: String }],
    notifyParty: [{ type: String }],
    portOfOrigin: [{ type: String }],
    finalDestination: [{ type: String }],
    incoterms: [{ type: String }],*/
