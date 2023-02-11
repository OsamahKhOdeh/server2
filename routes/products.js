import express from "express";

import { createProduct } from "../controllers/products.js";

const router = express.Router();
//import auth from "../middleware/auth.js";

//router.get("/search", getPostsBySearch);
//router.get("/", getPosts);
//0router.get("/:id", getPost);

router.post("/", createProduct);
//router.patch("/:id", auth, updatePost);
//router.delete("/:id", auth, deletePost);
//router.patch("/:id/likePost", auth, likePost);
//router.post("/:id/commentPost", commentPost);
export default router;
