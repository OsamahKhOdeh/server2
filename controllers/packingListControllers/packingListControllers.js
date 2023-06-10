import express from "express";
import mongoose from "mongoose";
import ProformaInvoice from "../../models/proformaInvoice.js";
import SignedPiPDF from "../../models/pdfSchema.js";
import PackingList from "../../models/PackingList/PackingList.js";
import asyncHandler from "express-async-handler";

const router = express.Router();
function calcPrice(item, location, currency) {
  let price = 0;
  if (location === "freezone" && currency === "AED") {
    price = item.freezonePriceAED;
  }
  if (location === "local" && currency === "AED") {
    price = item.LocalPriceAED;
  }
  if (location === "freezone" && currency === "USD") {
    price = item.freezonePrice;
  }
  if (location === "local" && currency === "USD") {
    price = item.LocalPrice;
  }

  return price;
}

export const createPackingList = async (req, res) => {
  const pkl = req.body;
  const newPkl = new PackingList(pkl);
  await newPkl.save(function (error, savedPackingList) {
    if (error) {
      // Check if the error is a validation error
      if (error.name === "ValidationError") {
        const validationErrors = {};
        for (let field in error.errors) {
          validationErrors[field] = error.errors[field].message;
        }
        console.log("Validation errors:", validationErrors);
        return res.status(400).json({ errors: validationErrors });
      } else {
        console.log("Error:", error);
        return res.status(500).json({ error: "An unexpected error occurred." });
      }
    } else {
      console.log("Packing list saved successfully:");
      res.header("Access-Control-Allow-Origin", "*");
      res.status(201).json(savedPackingList);
    }
  });
};

export const getPackingListInfo = async (req, res) => {
  const piNo = req.params.id;
  const pi = await ProformaInvoice.findOne({ pi_no: piNo });
  const signedPi = await SignedPiPDF.findOne({ pi_no: piNo }).exec();
  if (!pi || !signedPi) {
    return res.status(400).json({ message: "Wrong pi Number" });
  }
  let pklTotalPackages = 0;
  let pklTotalNetWeight = 0;
  let pklTotalGrossWeight = 0;
  let pklTotalPallets = 0;
  let pklTotalAmount = 0;
  let pklWarehouses = [];
  let pklBls = [];

  const bookedArray = signedPi.booked;

  bookedArray.map((item) => {
    item.bookedQty.map((bl) => {
      if (!pklWarehouses.includes(bl.warehouse)) {
        pklWarehouses.push(bl.warehouse);
      }
      if (!pklBls.includes(bl.code)) {
        pklBls.push(bl.code);
      }
    });
  });

  const piCustomer = pi.buyer_address;
  const piCurrency = pi.currency;
  const piEmployee = pi.employee;
  const piDate = pi.date;
  const piId = pi._id;
  let exporter = pi.exporter;
  let pklNo = 0;
  let invoiceNo = 0;
  let customer = "";
  let buyer = "";
  let truckPayload = 27000;
  let date = new Date(Date.now());
  let truckItems = [];
  let pklProducts = [];
  pi.products.map((piProduct) => {
    console.log(piProduct._id);

    const description = piProduct.country + " " + piProduct.category + " " + piProduct.code + " " + piProduct.brand;
    const booked = bookedArray.filter((item) => item.productId.toString() === piProduct._id.toString())[0].bookedQty;
    let bookedWarehouses = [];
    booked.map((item) => {
      const warehouseIndex = bookedWarehouses.findIndex((obj) => obj.warehouse === item.warehouse);
      if (warehouseIndex === -1) {
        bookedWarehouses.push({ warehouse: item.warehouse, qty: item.qty });
      } else {
        bookedWarehouses[warehouseIndex].qty += item.qty;
      }
    });
    pklProducts.push({
      productCode: piProduct.code,
      productCountry: piProduct.country,
      productCategory: piProduct.category,
      productCapacity: piProduct.capacity,
      productBrand: piProduct.brand,

      productId: piProduct._id,
      description: description,
      qty: piProduct.qty,
      pallet: 0,
      netWeight: piProduct.netWeight,
      grossWeight: piProduct.grossWeight,
      totalNetWeight: piProduct.qty * piProduct.netWeight,
      totalGrossWeight: piProduct.qty * piProduct.grossWeight,
      price: calcPrice(piProduct, pi.location, pi.currency),
      totalAmount: calcPrice(piProduct, pi.location, pi.currency) * piProduct.qty,
      booked: booked,
      bookedWarehouses,
    });
  });

  pklProducts.map((pklProduct) => {
    pklTotalPackages += pklProduct.qty;
    pklTotalNetWeight += pklProduct.totalNetWeight;
    pklTotalGrossWeight += pklProduct.totalGrossWeight;
    pklTotalPallets += pklProduct.pallet;
    pklTotalAmount += pklProduct.totalAmount;
  });

  let totalTrucks = Math.ceil(pklTotalGrossWeight / truckPayload);

  const pklInfoObject = {
    piCurrency,
    piCustomer,
    piEmployee,
    piDate,
    pklNo,
    piNo,
    invoiceNo,
    exporter,
    customer,
    piId,
    buyer,
    date,
    pklWarehouses,
    pklBls,
    pklTotalAmount,
    pklTotalGrossWeight,
    pklTotalNetWeight,
    pklTotalPackages,
    pklTotalPallets,
    pklProducts,
    truckPayload,
    totalTrucks,
  };

  try {
    res.status(200).json(pklInfoObject);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                                    TEMP                                    */
/* -------------------------------------------------------------------------- */
export const getPackingListInfoManual = async (req, res) => {
  const piNo = req.params.id;
  const pi = await ProformaInvoice.findOne({ pi_no: piNo });
  // const signedPi = await SignedPiPDF.findOne({ pi_no: piNo }).exec();
  if (!pi) {
    return res.status(400).json({ message: "Wrong pi Number" });
  }
  let pklTotalPackages = 0;
  let pklTotalNetWeight = 0;
  let pklTotalGrossWeight = 0;
  let pklTotalPallets = 0;
  let pklTotalAmount = 0;
  // let pklWarehouses = [];
  let pklBls = [];

  //const bookedArray = signedPi.booked;

  // bookedArray.map((item) => {
  //   item.bookedQty.map((bl) => {
  //     if (!pklWarehouses.includes(bl.warehouse)) {
  //       pklWarehouses.push(bl.warehouse);
  //     }
  //     if (!pklBls.includes(bl.code)) {
  //       pklBls.push(bl.code);
  //     }
  //   });
  // });

  const piCustomer = pi.buyer_address;
  const piEmployee = pi.employee;
  const piDate = pi.date;
  const piId = pi._id;
  let exporter = pi.exporter;
  let pklNo = 0;
  let invoiceNo = 0;
  let customer = "";
  let buyer = "";
  let truckPayload = 27000;
  let date = new Date(Date.now());
  let truckItems = [];
  let pklProducts = [];
  pi.products.map((piProduct) => {
    console.log(piProduct._id);

    const description = piProduct.country + " " + piProduct.category + " " + piProduct.code + " " + piProduct.brand;
    // const booked = bookedArray.filter((item) => item.productId.toString() === piProduct._id.toString())[0].bookedQty;
    // let bookedWarehouses = [];
    // booked.map((item) => {
    //   const warehouseIndex = bookedWarehouses.findIndex((obj) => obj.warehouse === item.warehouse);
    //   if (warehouseIndex === -1) {
    //     bookedWarehouses.push({ warehouse: item.warehouse, qty: item.qty });
    //   } else {
    //     bookedWarehouses[warehouseIndex].qty += item.qty;
    //   }
    // });
    if (piProduct.category === "Solar") {
      pklProducts.push({
        productCode: piProduct.code,
        productCountry: piProduct.country,
        productCategory: piProduct.category,
        productCapacity: piProduct.capacity,
        productBrand: piProduct.brand,
        productId: piProduct._id,
        description: description,
        qty: piProduct.qty / parseInt(piProduct.capacity),
        pallet: 0,
        netWeight: piProduct.netWeight * parseInt(piProduct.capacity),
        grossWeight: piProduct.grossWeight * parseInt(piProduct.capacity),
        totalNetWeight: (piProduct.qty / parseInt(piProduct.capacity)) * piProduct.netWeight * parseInt(piProduct.capacity),
        totalGrossWeight: (piProduct.qty / parseInt(piProduct.capacity)) * piProduct.grossWeight * parseInt(piProduct.capacity),
        price: calcPrice(piProduct, pi.location, pi.currency) * parseInt(piProduct.capacity),
        totalAmount: calcPrice(piProduct, pi.location, pi.currency) * piProduct.qty * parseInt(piProduct.capacity),
        // booked: booked,
        // bookedWarehouses,
      });
    } else
      pklProducts.push({
        productCode: piProduct.code,
        productCountry: piProduct.country,
        productCategory: piProduct.category,
        productCapacity: piProduct.capacity,
        productBrand: piProduct.brand,
        productId: piProduct._id,
        description: description,
        qty: piProduct.qty,
        pallet: 0,
        netWeight: piProduct.netWeight,
        grossWeight: piProduct.grossWeight,
        totalNetWeight: piProduct.qty * piProduct.netWeight,
        totalGrossWeight: piProduct.qty * piProduct.grossWeight,
        price: calcPrice(piProduct, pi.location, pi.currency),
        totalAmount: calcPrice(piProduct, pi.location, pi.currency) * piProduct.qty,
        // booked: booked,
        // bookedWarehouses,
      });
  });
  console.log(pklProducts);
  pklProducts.map((pklProduct) => {
    pklTotalPackages += pklProduct.qty;
    pklTotalNetWeight += pklProduct.totalNetWeight;
    pklTotalGrossWeight += pklProduct.totalGrossWeight;
    pklTotalPallets += pklProduct.pallet;
    pklTotalAmount += pklProduct.totalAmount;
  });

  let totalTrucks = Math.ceil(pklTotalGrossWeight / truckPayload);
  let allBooked = [];
  console.log(pi.booked);
  pi.booked.map((item1) => {
    let bookedWarehouses = [];
    item1.bookedQty.map((item) => {
      let warehouseIndex = bookedWarehouses.findIndex((obj) => obj.warehouse === item.warehouse);
      if (warehouseIndex === -1) {
        bookedWarehouses.push({ warehouse: item.warehouse, bl: [{ bl: item.code, qty: item.qty }] });
      } else {
        bookedWarehouses[warehouseIndex].bl.push({ bl: item.code, qty: item.qty });
      }
    });
    allBooked.push({ product: item1.product, bookedWarehouses });
  });

  const pklInfoObject = {
    piCustomer,
    piEmployee,
    piDate,
    pklNo,
    piNo,
    invoiceNo,
    exporter,
    customer,
    piId,
    buyer,
    date,
    // pklWarehouses,
    pklBls,
    pklTotalAmount,
    pklTotalGrossWeight,
    pklTotalNetWeight,
    pklTotalPackages,
    pklTotalPallets,
    pklProducts,
    truckPayload,
    totalTrucks,
    allBooked,
  };

  try {
    res.status(200).json(pklInfoObject);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */

export const getAllPackingLists = async (req, res) => {
  try {
    //const total = await Product.countDocuments({});
    const packingLists = await PackingList.find().sort({
      updatedAt: -1,
    });

    res.json(packingLists);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEmployeePackingLists = async (req, res) => {
  try {
    const employee_name = req.query.employeename;
    console.log(employee_name);
    if (!employee_name) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const packingLists = await PackingList.find({
      employee: employee_name,
    }).sort({ createdAt: -1 });

    res.json(packingLists);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePackingListStatus = async (req, res) => {
  console.log("UPDATAEEEE");

  const id = req.params.id;
  const newStatus = req.body.newStatus;
  const manager = req.body.manager;
  const managerApproval = req.body.managerApproval;
  const managerMessage = req.body.managerMessage;

  console.log("🚀" + req.body.managerMessage);
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No ProformaInvoice with id: ${id}`);
  // Does the Proforma exist to update?
  const pkl = await PackingList.findById(id).exec();
  if (!pkl) {
    return res.status(400).json({ message: "PackingList not found" });
  }
  pkl.status = newStatus;
  if (managerApproval !== undefined) pkl.managerApproval = managerApproval;
  if (managerMessage) {
    pkl.managerMessage = managerMessage;
  }
  if (manager) {
    pkl.manager = manager;
  }

  const updatedPackingList = await pkl.save();

  res.json({
    message: `${updatedPackingList._id} updated and set to ${updatedPackingList.status}`,
  });
};

// @desc Delete a PKL
// @route DELETE /pkl
// @access Private
export const deletePackingList = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: " ID Required" });
  }

  // Does the user exist to delete?
  const pkl = await PackingList.findById(id).exec();

  if (!pkl) {
    return res.status(400).json({ message: "PI not found" });
  }

  const result = await pkl.deleteOne();

  const reply = `PKL ${result} with ID ${result._id} deleted`;

  res.json(reply);
});

export default router;
