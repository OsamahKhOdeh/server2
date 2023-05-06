import express from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

import Product from "../models/product.js";

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
    {
      /*await Product.updateMany({}, { $set: { lastUpdateBy: "" } }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });*/
    }
    const products = await Product.find().sort({ _id: -1 });

    res.json({ data: products });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByFilter = async (req, res) => {
  const { categories, countries, companies, brands } = req.query;
  const page = req.query.page;
  console.log(page);

  console.log(categories.split(","), countries.split(","));
  console.log(companies.split(","), brands.split(","));
  const products = await Product.find();
  res.json({ data: products });
};

export const getProductsBySearch = async (req, res) => {
  const filters = req.query.filters;
  const page = req.query.page;
  console.log(filters, page);
  const { categories, countries, companies, brands, capacities } = req.query;
  console.log(categories.split(","), countries.split(","));
  console.log(companies.split(","), brands.split(","));
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
      const products = await Product.find(Q_ALL_BRANDS);
      res.json({ data: products });
      return;
    }
    if (isBrands && isCompanies && isCountries && isCategories) {
      const products1 = await Product.find(Q_ALL_BRANDS);
      const products2 = await Product.find(Q_ALL_COMPANIES);
      const products = [...products1, ...products2];
      res.json({ data: products });
      return;
    }

    if (isCompanies && isCountries && isCategories) {
      const products = await Product.find(Q_ALL_COMPANIES);
      console.log(products.length);
      res.json({ data: products });
      return;
    }

    if ((isCategories && !isCountries) || (isCategories && countries.includes("All"))) {
      if (categories.includes("All")) {
        const products = await Product.find();
        res.json({ data: [...products, productsForCountries] });
        return;
      }
      products = await Product.find(Q_ALL_CATEGORIES);
      res.json({ data: [...products, productsForCountries] });
    } else if (!isCategories && isCountries) {
      if (countries.includes("All")) {
        const products = await Product.find();
        res.json({ data: products });
        return;
      }
      const products = await Product.find(Q_ALL_COUNTRIES);
      res.json({ data: products });
      return;
    } else if (isCountries && isCategories) {
      /// All Categories & All Countries
      if (categories.split(",").includes("All") && countries.split(",").includes("All")) {
        const products = await Product.find();
        res.json({ data: [...products, con] });
        return;
      } else if (categories.split(",").includes("All")) {
        const products = await Product.find(Q_ALL_COUNTRIES);
        res.json({ data: [...products, con] });
        return;
      } else if (countries.split(",").includes("All")) {
        const products = await Product.find(Q_ALL_CATEGORIES);
        res.json({ data: [...products, con] });
        return;
      }
      const products = await Product.find({ $and: [Q_ALL_CATEGORIES, Q_ALL_COUNTRIES] });
      res.json({
        data: [...products, con],
      });
    } else {
      const products = await Product.find();
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

  console.log(id);
  console.log(update);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  const updatedProduct = await Product.findOneAndUpdate({ _id: id }, { $set: update }, function (err, result) {
    if (err) {
      res.status(404).json({ message: err.message });

      console.log(err);
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
  console.log(req.body);
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

export default router;
