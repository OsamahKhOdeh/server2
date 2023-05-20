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

const router = express.Router();
//import auth from "../middleware/auth.js";

router.get("/search", getProductsBySearch);
//router.get("/search", getProductsByFilter);

router.get("/", getProducts);
//0router.get("/:id", getPost);

router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.patch("/stock/:id", updateProductStock);
router.patch("/stockall/:id", updateStock);
router.patch("/productqty/:id", updateProductWarehouseBlQty);
router.patch("/productbookedqty/:id", updateProductWarehouseBlBookedQty);
router.patch("/productmoveavailable/:id", updateProductMoveToAvailable);
router.patch("/productmovecoming/:id", updateProductMoveToComing);
router.patch("/bookpiproducts/:id", bookPiProducts);
router.patch("/unbookpiproducts/:id", unbookPiProducts);

router.delete("/:id", deleteProduct);
//router.patch("/update", updateDBOps);

//router.patch("/:id", auth, updatePost);
//router.delete("/:id", auth, deletePost);
//router.patch("/:id/likePost", auth, likePost);
//router.post("/:id/commentPost", commentPost);
export default router;
