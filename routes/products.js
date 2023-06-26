import express from "express";

import {
  createProduct,
  getProducts,
  getProductsBySearch,
  getProductsByFilter,
  updateProduct,
  updateDBOps,
  deleteProduct,
  updateProductStock,
  updateStock,
  updateProductWarehouseBlQty,
  updateProductWarehouseBlBookedQty,
  updateProductMoveToAvailable,
  updateProductMoveToComing,
  bookPiProducts,
  unbookPiProducts,
} from "../controllers/products.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();
//import auth from "../middleware/auth.js";

router.get("/search", getProductsBySearch);
//router.get("/search", getProductsByFilter);

router.get("/", getProducts);
//0router.get("/:id", getPost);

router.post("/",verifyJWT, createProduct);
router.patch("/:id",verifyJWT, updateProduct);
router.patch("/stock/:id",verifyJWT, updateProductStock);
router.patch("/stockall/:id",verifyJWT, updateStock);
router.patch("/productqty/:id",verifyJWT, updateProductWarehouseBlQty);
router.patch("/productbookedqty/:id",verifyJWT, updateProductWarehouseBlBookedQty);
router.patch("/productmoveavailable/:id",verifyJWT, updateProductMoveToAvailable);
router.patch("/productmovecoming/:id",verifyJWT, updateProductMoveToComing);
router.patch("/bookpiproducts/:id",verifyJWT, bookPiProducts);
router.patch("/unbookpiproducts/:id",verifyJWT, unbookPiProducts);

router.delete("/:id", deleteProduct);
//router.patch("/update", updateDBOps);

//router.patch("/:id", auth, updatePost);
//router.delete("/:id", auth, deletePost);
//router.patch("/:id/likePost", auth, likePost);
//router.post("/:id/commentPost", commentPost);
export default router;
