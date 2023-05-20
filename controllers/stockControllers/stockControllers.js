import express from "express";

import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

import StockItem from "../../models/Stock/StockItem.js";
import ProformaInvoice from "../../models/proformaInvoice.js";
import Product from "../../models/product.js";

const router = express.Router();
/* -------------------------------------------------------------------------- */
/*                                add to stock                                */
/* -------------------------------------------------------------------------- */
export const addStockItem = async (req, res) => {
  const productId = req.params.id;
  const { code, qty, date, warehouse, productBrand, productCode, productCapacity } = req.body;
  // Confirm data
  if (!code || !qty || !date || !warehouse || !productCode) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const stockItemObject = { productId, bl: code, qty, date, warehouse, productCode, productBrand, productCapacity };
  console.log({ code, qty, date, warehouse });

  // Create and store new user

  const stockItem = await StockItem.create(stockItemObject);

  if (stockItem) {
    //created
    res.status(201).json(stockItem);
  } else {
    res.status(400).json({ message: "something went wrong" });
  }
};

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                   book pi                                  */
/* -------------------------------------------------------------------------- */

export const bookPiProducts = async (req, res) => {
  const id = req.params.id;
  console.log();
  const booked = [];

  try {
    const proformaInvoice = await ProformaInvoice.findById(id);
    const products = proformaInvoice.products;
    let productsToUpdate = [];
    products.map((product) => {
      productsToUpdate.push({ id: product._id, qty: product.qty });
    });
    console.log(",,,,,,,,,");
    console.log(productsToUpdate);
    console.log("..........");
    productsToUpdate.map(async (product) => {
      const bookedItem = await bookProduct(product.id, product.qty);
      console.log(bookedItem);
      booked.push(bookedItem);
    });
    const proforma = await SignedPiPDF.findOne({ pi_id: id }).exec();
    if (!proforma) {
      console.log("ProformaInvoice not found");
    }
    proforma.status = "BOOKED";
    proforma.pi_done_status.push("BOOKED");
    proforma.booked = booked;
    const updatedProformaInvoice = await proforma.save();

    res.json(productsToUpdate);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const bookProduct = async (id, qty) => {
  let booked = { productId: id, bookedQty: [] };
  try {
    let stockItems = await StockItem.find({ productId: id });
    //Remove items with warehouse equal to coming or production
    stockItems = stockItems.filter((item) => item.warehouse !== "coming" && item.warehouse !== "production");
    // Sort items by bl date ascending from the oldest to the latest
    stockItems = stockItems.sort((a, b) => new Date(a.date) - new Date(b.date));
    //loop through stock items
    for (let i = 0; i < stockItems.length; i++) {
      const currentObject = stockItems[i];

      // Decrease the quantity from the current object
      if (qty >= currentObject.available) {
        let bookedFromItem = currentObject.available;
        qty -= currentObject.available;
        currentObject.booked += currentObject.available;
        currentObject.available = 0;
        await currentObject.save();
        booked.bookedQty.push({
          warehouse: currentObject.warehouse,
          code: currentObject.bl,
          qty: bookedFromItem,
        });
        console.log(currentObject.bl + " " + currentObject.booked);
      } else {
        let bookedFromItem = qty;

        currentObject.booked += qty;
        currentObject.available = currentObject.available - qty;
        qty = 0;
        await currentObject.save();
        booked.bookedQty.push({
          warehouse: currentObject.warehouse,
          code: currentObject.bl,
          qty: bookedFromItem,
        });
        console.log(currentObject.bl + " " + currentObject.booked);
        break;
        // Exit the loop since the quantity has been fully decrease
      }
    }
    //const item_index = product.bl.findIndex((obj) => obj.warehouse === warehouse && obj.code === code);
    // product.bl[0].booked += qty;
    //  console.log(product.bl);
    try {
      // product.markModified("bl");
      //  await product.save();
    } catch (err) {}
    // product.save();
  } catch (err) {
    console.log(err);
  }
  return booked;
};

export const getStock = async (req, res) => {
  const ids = ["645e3af02d073e0413c733f9", "645e3aba2d073e0413c733f7", "644d2f00f6ac4351d41d5c3b"];
  const products = await Product.find();
  const stockItems = await StockItem.find();

  let stock = [];
  products.map((product) => {
    let productQty = 0;
    let productBookedQty = 0;
    let productAvailableQty = 0;
    let productComingQty = 0;
    let productComingBookedQty = 0;
    let productUnderProductionQty = 0;

    console.log(product._id);

    const productStockItems = stockItems.filter((stockItem) => stockItem.productId.includes(product._id));
    const productWarehouseQuantities = productStockItems.reduce((accumulator, stockItem) => {
      if (stockItem.warehouse !== "coming" && stockItem.warehouse !== "production") {
        productAvailableQty += stockItem.qty;
        productAvailableQty += stockItem.available;
        productBookedQty += stockItem.booked;
      }
      const warehouseIndex = accumulator.findIndex((item) => item.warehouse === stockItem.warehouse);

      if (warehouseIndex !== -1) {
        accumulator[warehouseIndex].warehouseQty += stockItem.qty;
        accumulator[warehouseIndex].warehouseAvailableQty += stockItem.available;
        accumulator[warehouseIndex].warehouseBookedQty += stockItem.booked;
        accumulator[warehouseIndex].warehouseBLs.push({
          bl: stockItem.bl,
          blQty: stockItem.qty,
          blBookedQty: stockItem.booked,
          blAvailableQty: stockItem.available,
        });
      } else {
        accumulator.push({
          warehouse: stockItem.warehouse,
          warehouseQty: stockItem.qty,
          warehouseAvailableQty: stockItem.available,
          warehouseBookedQty: stockItem.booked,
          warehouseBLs: [{ bl: stockItem.bl, blQty: stockItem.qty, blBookedQty: stockItem.booked, blAvailableQty: stockItem.available }],
        });
      }

      return accumulator;
    }, []);
    stock.push({ productId: product._id, productWarehouseQuantities, productQty, productBookedQty, productAvailableQty });
  });
  res.json(stock);
};
