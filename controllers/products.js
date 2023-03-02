import express from "express";
import mongoose from "mongoose";

import Product from "../models/product.js";

const router = express.Router();

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
  const { page } = req.query;
  try {
    const LIMIT = 20;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await Product.countDocuments({});
    const products = await Product.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

    res.json({ data: products, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
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

    if (isCategories && !isCountries) {
      if (categories.includes("All")) {
        const products = await Product.find();
        res.json({ data: products });
        return;
      }
      products = await Product.find(Q_ALL_CATEGORIES);
      res.json({ data: products });
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
        res.json({ data: products });
        return;
      } else if (categories.split(",").includes("All")) {
        const products = await Product.find(Q_ALL_COUNTRIES);
        res.json({ data: products });
        return;
      } else if (countries.split(",").includes("All")) {
        const products = await Product.find(Q_ALL_CATEGORIES);
        res.json({ data: products });
        return;
      }
      const products = await Product.find({ $and: [Q_ALL_CATEGORIES, Q_ALL_COUNTRIES] });
      res.json({ data: products });
    } else {
      const products = await Product.find();
      res.json({ data: products });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  console.log("UPDATAEEEE");
  const id = req.params.id;
  console.log(id);
  console.log(req.query);
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No product with id: ${id}`);

  const updatedProduct = req.body;
  // const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
  await Product.findByIdAndUpdate(id, updatedProduct, { new: true });

  res.json(updatedProduct);
};

export default router;
