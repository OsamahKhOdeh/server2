import express from "express";

import { createProduct, getProducts, getProductsBySearch, getProductsByFilter, updateProduct, updateDBOps } from "../controllers/products.js";

const router = express.Router();
//import auth from "../middleware/auth.js";

router.get("/search", getProductsBySearch);
//router.get("/search", getProductsByFilter);

router.get("/", getProducts);
//0router.get("/:id", getPost);

router.post("/", createProduct);
router.patch("/:id", updateProduct);
//router.patch("/update", updateDBOps);

//router.patch("/:id", auth, updatePost);
//router.delete("/:id", auth, deletePost);
//router.patch("/:id/likePost", auth, likePost);
//router.post("/:id/commentPost", commentPost);
export default router;
