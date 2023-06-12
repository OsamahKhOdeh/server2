import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

import Product from "../models/product.js";
import ProformaInvoice from "../models/proformaInvoice.js";
import SignedPiPDF from "../models/pdfSchema.js";

const router = express.Router();
const con = {
  _id: "1",
  category: "1",
  country: "1",
  company: "1",
  code: "1",
  brand: "1",
  price: 1,
  capacity: "1",
  image: "1",
  description: "1",
  netWeight: 1,
  grossWeight: 1,
  palatSize: 1,
  bl: [],
  __v: 0,
  stock: 0,
};
const productsForCountries = {
  _id: "2",
  category: "2",
  country: "2",
  company: "2",
  code: "2",
  brand: "2",
  price: 2,
  capacity: "2",
  image: "2",
  description: "2",
  netWeight: 2,
  grossWeight: 2,
  palatSize: 2,
  bl: [],
  __v: 0,
  stock: 0,
};

export const createProduct = async (req, res) => {
  const product = req.body;

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    /* await Product.updateMany({}, { $set: { stockAll: [] } }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
*/
    const products = await Product.find().sort({ _id: -1 });

    res.json({ data: products });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByFilter = async (req, res) => {
  const { categories, countries, companies, brands } = req.query;
  const page = req.query.page;

  const products = await Product.find();
  res.json({ data: products });
};

export const getProductsBySearch = async (req, res) => {
  const filters = req.query.filters;
  const page = req.query.page;
  const { categories, countries, companies, brands, capacities } = req.query;
  //   capacities = JSON.parse(capacities);
  //let capacities2 = JSON.parse(capacities);
  //console.log(capacities2);
  const isCategories = categories.split(",")[0] !== "";
  const isCountries = countries.split(",")[0] !== "";
  const isCompanies = companies.split(",")[0] !== "";
  let isBrands = brands.split(",")[0] !== "";

  if (brands.split(",").includes("undefined")) {
    isBrands = false;
  }
  // const isCapacities = capacities.split(",")[0] !== "";
  try {
    const Q_ALL_CATEGORIES = { category: { $in: categories.split(",") } };
    const Q_ALL_COUNTRIES = { country: { $in: countries.split(",") } };
    const Q_ALL_COMPANIES = { company: { $in: companies.split(",") } };
    const Q_ALL_BRANDS = { brand: { $in: brands.split(",") } };

    // const title = new RegExp(searchQuery, "i");
    let products = [];
    let caps = [];
    /*
    if (isCapacities) {
      const products = await Product.find({ capacity: { $in: capacities.split(",") } });
      res.json({ data: products });
      return;
    }
*/
    if (isBrands && !isCompanies && isCountries && isCategories) {
      const products = await Product.find(Q_ALL_BRANDS).sort({ stock: -1 });
      res.json({ data: products });
      return;
    }
    if (isBrands && isCompanies && isCountries && isCategories) {
      const products1 = await Product.find(Q_ALL_BRANDS).sort({ stock: -1 });
      const products2 = await Product.find(Q_ALL_COMPANIES).sort({ stock: -1 });
      const products = [...products1, ...products2];
      res.json({ data: products });
      return;
    }

    if (isCompanies && isCountries && isCategories) {
      const products = await Product.find(Q_ALL_COMPANIES).sort({ stock: -1 });
      res.json({ data: products });
      return;
    }

    if ((isCategories && !isCountries) || (isCategories && countries.includes("All"))) {
      if (categories.includes("All")) {
        const products = await Product.find().sort({ stock: -1 });
        res.json({ data: [...products, productsForCountries] });
        return;
      }
      products = await Product.find(Q_ALL_CATEGORIES).sort({ stock: -1 });
      res.json({ data: [...products, productsForCountries] });
    } else if (!isCategories && isCountries) {
      if (countries.includes("All")) {
        const products = await Product.find().sort({ stock: -1 });
        res.json({ data: products });
        return;
      }
      const products = await Product.find(Q_ALL_COUNTRIES).sort({ stock: -1 });
      res.json({ data: products });
      return;
    } else if (isCountries && isCategories) {
      /// All Categories & All Countries
      if (categories.split(",").includes("All") && countries.split(",").includes("All")) {
        const products = await Product.find().sort({ stock: -1 });
        res.json({ data: [...products, con] });
        return;
      } else if (categories.split(",").includes("All")) {
        const products = await Product.find(Q_ALL_COUNTRIES).sort({ stock: -1 });
        res.json({ data: [...products, con] });
        return;
      } else if (countries.split(",").includes("All")) {
        const products = await Product.find(Q_ALL_CATEGORIES).sort({ stock: -1 });
        res.json({ data: [...products, con] });
        return;
      }
      const products = await Product.find({ $and: [Q_ALL_CATEGORIES, Q_ALL_COUNTRIES] }).sort({ stock: -1 });
      res.json({
        data: [...products, con],
      });
    } else {
      const products = await Product.find().sort({ stock: -1 });
      res.json({ data: [...products, productsForCountries] });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProductStock = async (req, res) => {
  const id = req.params.id;
  const newVal = req.body.value;
  const property = req.body.property;
  const employee = req.body.employee;
  const update = {};
  update[property] = newVal;
  update["lastUpdateBy"] = employee;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, { $set: update }, function (err, result) {
    if (err) {
      res.status(404).json({ message: err.message });
    } else {
      console.log("Stock Update Success");
      res.json(`product with id ${id} updated successfully`);
    }
  });
};

export const updateProduct = async (req, res) => {
  const id = req.params.id;
  console.log(req.query);
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  const updatedProduct = req.body;
  // const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await Product.findByIdAndUpdate(id, updatedProduct, { new: true });

  res.json(updatedProduct);
};

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const result = await product.deleteOne();

  const reply = `Product ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

export const updateDBOps = async (req, res) => {
  try {
    Product.updateMany(
      {},
      { $set: { images: ["https://res.cloudinary.com/dwen6dx2a/image/upload/v1676527391/vhk7vmtc0dtguqoyvc7a.png"] } },
      false,
      true
    );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  res.json("Updated");
};

export const updateStock = async (req, res) => {
  const id = req.params.id;
  const { code, qty, date, warehouse, status, booked } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  try {
    const product = await Product.findOne({ _id: id });
    if (product) {
      product.bl.push({ code, qty, date, warehouse, status, booked });
      try {
        await product.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(product.bl);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
    }
  } catch (err) {}
};

export const updateProductWarehouseBlQty = async (req, res) => {
  const id = req.params.id;
  const { code, qty, date, warehouse, booked } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  try {
    const product = await Product.findOne({ _id: id });
    if (product) {
      const item_index = product.bl.findIndex((obj) => obj.warehouse === warehouse && obj.code === code);
      product.bl[item_index].qty = qty;
      product.bl[item_index].date = date;
      product.bl[item_index].booked = booked;
      try {
        product.markModified("bl");
        await product.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(product.bl);
      } catch (err) {
        res.status(409).json({ message: err });
      }
    }
  } catch (err) {
    res.status(409).json({ message: err });
  }
};

export const updateProductWarehouseBlBookedQty = async (req, res) => {
  const id = req.params.id;
  const { qty, warehouse, code } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  try {
    const product = await Product.findOne({ _id: id });
    if (product) {
      const item_index = product.bl.findIndex((obj) => obj.warehouse === warehouse && obj.code === code);
      product.bl[item_index].booked = qty;

      try {
        product.markModified("bl");
        await product.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(product.bl);
      } catch (err) {
        res.status(409).json({ message: err });
      }
    }
  } catch (err) {
    res.status(409).json({ message: err });
  }
};

export const updateProductMoveToAvailable = async (req, res) => {
  const id = req.params.id;
  const { date, warehouse, code } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  try {
    const product = await Product.findOne({ _id: id });
    if (product) {
      const item_index = product.bl.findIndex((obj) => obj.warehouse === "coming" && obj.code === code);
      product.bl[item_index].warehouse = warehouse;
      product.bl[item_index].date = date;

      try {
        product.markModified("bl");
        await product.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(product.bl);
      } catch (err) {
        res.status(409).json({ message: err });
      }
    }
  } catch (err) {
    res.status(409).json({ message: err });
  }
};

export const updateProductMoveToComing = async (req, res) => {
  const id = req.params.id;
  const { date, warehouse, code, qty } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);
  try {
    const product = await Product.findOne({ _id: id });
    if (product) {
      const item_index = product.bl.findIndex((obj) => obj.warehouse === "production" && obj.qty === qty);
      product.bl[item_index].warehouse = "coming";
      product.bl[item_index].date = date;
      product.bl[item_index].code = code;

      try {
        product.markModified("bl");
        await product.save();
        res.header("Access-Control-Allow-Origin", "*");
        res.status(201).json(product.bl);
      } catch (err) {
        res.status(409).json({ message: err });
      }
    }
  } catch (err) {
    res.status(409).json({ message: err });
  }
};

export const bookPiProducts = async (req, res) => {
  const id = req.params.id;
  const booked = [];

  try {
    const proformaInvoice = await ProformaInvoice.findById(id);
    const products = proformaInvoice.products;
    let productsToUpdate = [];
    products.map((product) => {
      productsToUpdate.push({ id: product._id, qty: product.qty });
    });
    productsToUpdate.map(async (product) => {
      const bookedItem = await bookProduct(product.id, product.qty);
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
    const product = await Product.findOne({ _id: id });
    if (product) {
      const stockBl = product.bl.filter((bl) => bl.warehouse !== "coming" && bl.warehouse !== "production");
      const sortedBl = stockBl.sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let i = 0; i < sortedBl.length; i++) {
        const currentObject = sortedBl[i];

        // Decrease the quantity from the current object
        if (qty >= currentObject.qty - currentObject.booked) {
          qty -= currentObject.qty - currentObject.booked;
          booked.bookedQty.push({
            warehouse: currentObject.warehouse,
            code: currentObject.code,
            qty: currentObject.qty - currentObject.booked,
          });
          currentObject.booked = currentObject.qty;
        } else {
          currentObject.booked += qty;
          booked.bookedQty.push({
            warehouse: currentObject.warehouse,
            code: currentObject.code,
            qty: qty,
          });

          qty = 0;
          break;
          // Exit the loop since the quantity has been fully decreased
        }
      }
      //const item_index = product.bl.findIndex((obj) => obj.warehouse === warehouse && obj.code === code);
      // product.bl[0].booked += qty;
      //  console.log(product.bl);
      try {
        product.markModified("bl");
        await product.save();
      } catch (err) {}
      // product.save();
    }
  } catch (err) {
    console.log(err);
  }

  return booked;
};

export const unbookPiProducts = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const booked = [];

  try {
    const proforma = await SignedPiPDF.findOne({ pi_id: id }).exec();
    if (!proforma) {
      console.log("ProformaInvoice not found");
    }
    const productsToUnbook = proforma.booked;
    productsToUnbook.map((item) => {
      unBookProduct(item.productId, item.bookedQty);
    });

    proforma.status = "CONFIRMED";
    proforma.pi_done_status = proforma.pi_done_status.filter((status) => status !== "BOOKED");
    proforma.booked = [];
    const updatedProformaInvoice = await proforma.save();

    res.json(updatedProformaInvoice);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const unBookProduct = async (id, qtys) => {
  let booked = { productId: id, bookedQty: [] };
  try {
    const product = await Product.findOne({ _id: id });
    if (product) {
      //    const stockBl = product.bl.filter((bl) => bl.warehouse !== "coming" && bl.warehouse !== "production");

      qtys.map((item) => {
        const blIndex = product.bl.findIndex((obj) => obj.warehouse === item.warehouse && obj.code === item.code);
        product.bl[blIndex].booked -= item.qty;
      });

      //const item_index = product.bl.findIndex((obj) => obj.warehouse === warehouse && obj.code === code);
      // product.bl[0].booked += qty;
      //  console.log(product.bl);
      try {
        product.markModified("bl");
        await product.save();
      } catch (err) {}
      // product.save();
    }
  } catch (err) {
    console.log(err);
  }

  return booked;
};

export default router;
