import express from "express";
import { sendMail } from "../../controllers/communicationControllers/mailControllers/mailControllers.js";
const router = express.Router();

router.post("/send-mail", sendMail);

export default router;
