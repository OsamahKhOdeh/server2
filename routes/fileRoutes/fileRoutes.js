import express from "express";
import { uploadFile } from "../../controllers/fileControllers/fileUploadControllers.js";

const router = express.Router();

// Route for single file upload
router.post("/upload", uploadFile);

// Route for multiple file upload
//router.post("/upload-multiple", uploadMultipleFiles);

export default router;
