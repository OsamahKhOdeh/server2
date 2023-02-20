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
  try {
    const products = await Product.find();

    res.json({ data: products });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsBySearch = async (req, res) => {
  const { categories, countries, companies, brands, capacities } = req.query;
  console.log(categories.split(","), countries.split(","));
  console.log(companies.split(","), brands.split(","), capacities.split(","));
  //   capacities = JSON.parse(capacities);
  //  let capacities2 = JSON.parse(capacities);
  // console.log(capacities2);
  const isCategories = categories.split(",")[0] !== "";
  const isCountries = countries.split(",")[0] !== "";
  const isCompanies = companies.split(",")[0] !== "";
  const isBrands = brands.split(",")[0] !== "";
  const isCapacities = capacities.split(",")[0] !== "";

  console.log(isCategories + "ooo" + isCountries + "ooo" + isCompanies + "ooo" + isBrands + "ooo" + isCapacities);
  try {
    // const title = new RegExp(searchQuery, "i");
    let products = [];
    let caps = [];
    if (isCapacities && !isBrands && !isCompanies && !isCountries && !isCategories) {
      const products = await Product.find({ brand: { $in: capacities.split(",") } });
      res.json({ data: products });
      console.log(products.length);
      return;
    }
    if (isBrands && !isCompanies && !isCountries && !isCategories) {
      const products = await Product.find({ brand: { $in: brands.split(",") } });
      res.json({ data: products });
      console.log(products.length);
      return;
    }
    if (isCompanies && !isCountries && !isCategories) {
      const products = await Product.find({ company: { $in: companies.split(",") } });
      res.json({ data: products });
      console.log(products.length);
      return;
    }
    if (isCategories && !isCountries) {
      console.log("!!!!!!!");
      const products = await Product.find({ category: { $in: categories.split(",") } });
      res.json({ data: products });
      console.log(products.length);
    } else if (!isCategories && isCountries) {
      const products = await Product.find({ country: { $in: countries.split(",") } });
      res.json({ data: products });
      console.log(products.length);
    } else if (isCountries && isCategories) {
      const products = await Product.find({ $and: [{ category: { $in: categories.split(",") } }, { country: { $in: countries.split(",") } }] });
      res.json({ data: products });
      console.log(products.length);
    } else {
      const products = await Product.find();
      res.json({ data: products });
    }
    /*else if (isCategories) products = await Product.find({ category: { $in: categories.split(",") } });
    else if (isCountries) products = await Product.find({ country: { $in: countries.split(",") } });
*/
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
