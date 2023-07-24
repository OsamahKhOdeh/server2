import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { logRequest, setPoweredByHeader } from "./config/middleware.js";
import cors from "cors";
import morgan from "morgan";
import { morganLogger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { updateStock } from "./controllers/stockControllers/stockControllers.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
import fs from "fs";
import requestIp from "request-ip";
import connect from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
import compression from "compression";
import _ from "lodash";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
console.log(
  __dirname
    .split("\\")
    .slice(0, __dirname.split("\\").length - 2)
    .join("\\")
);
console.log(
  __dirname
    .split("\\")
    .slice(0, __dirname.split("\\").length - 1)
    .join("\\")
);
export const HOME_DIR = __dirname
  .split("\\")
  .slice(0, __dirname.split("\\").length - 2)
  .join("\\");
if (!fs.existsSync(HOME_DIR + "/po")) {
  fs.mkdirSync(HOME_DIR + "/po");
  console.log("Directory created successfully.");
} else {
  console.log("Directory already exists.");
}
dotenv.config();

/* ----------------------- Middleware Configuration ------------------------- */
app.use(helmet());
app.disable("x-powered-by");
app.use(morgan("combined", { stream: fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" }) }));

// Custom logger middleware
app.use(logger);

// Middleware to get client IP address
app.use(requestIp.mw());

// Middleware to log request details
app.use(logRequest);

// Middleware to set the X-Powered-By header
app.use(setPoweredByHeader);

// JSON body parsing middleware
app.use(express.json({ limit: "30mb", extended: true }));

// URL-encoded body parsing middleware
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Cross-origin resource sharing middleware
app.use(cors(corsOptions));

// Cookie parsing middleware
app.use(cookieParser());

// Error handling middleware
app.use(errorHandler);

// compress all responses
app.use(compression());
/* -------------------------------------------------------------------------- */

/* --------------------------- Rate Limiter Setup --------------------------- */
const rateLimiter = new RateLimiterMemory({ points: 5, duration: 1 });

// Rate limiting middleware to prevent brute-force attacks
app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send("Too Many Requests"));
});
/* -------------------------------------------------------------------------- */

/* ----------------------- File Upload Configuration ------------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

// File upload route
app.post("/upload", uploadStorage.single("file"), async (req, res) => {
  try {
    if (req.file) {
      res.send({
        status: true,
        message: "File Uploaded!",
      });
    } else {
      res.status(400).send({
        status: false,
        data: "File Not Found :(",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// File download route
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename + ".pdf");
  res.download(filePath, `${req.params.filename}.pdf`, (err) => {
    if (err) {
      res.send({
        error: err,
        msg: "Problem downloading the file",
      });
    }
  });
});
/* -------------------------------------------------------------------------- */

/* ----------------------------- API Routes --------------------------------- */
import productRoutes from "./routes/products.js";
import proformaInvoiceRoutes from "./routes/proformaInvoice.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import poInfoRoutes from "./routes/poInfoRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import packingListRoutes from "./routes/packingListRoutes/packingListRoutes.js";
import warrantyRoutes from "./routes/WarrantyRoutes/WarrantyRoutes.js";
import processTrakingRoutes from "./routes/processTrackingRoutes/processTrakingRoutes.js";
import supplierRoutes from "./routes/supplierRoutes/supplierRoutes.js";
import forwarderRoutes from "./routes/forwarderRoutes/forwarderRoutes.js";
import mailRoutes from "./routes/communicationRoutes/mailRoutes.js";
import customerRoutes from "./routes/customerRoutes/customerRoutes.js";
import shippingAgentRoutes from "./routes/shippingAgentRoutes/shippingAgentRoutes.js";
import clearanceAgentRoutes from "./routes/clearanceAgentRoutes/clearanceAgentRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes/warehouseRoutes.js";
import { logger } from "./middleware/logger.js";
import fileRoutes from "./routes/fileRoutes/fileRoutes.js";

// Registering API routes
app.use("/products", productRoutes);
app.use("/pi", proformaInvoiceRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/poinfo", poInfoRoutes);
app.use("/purchaseorder", purchaseOrderRoutes);
app.use("/stock", stockRoutes);
app.use("/packinglist", packingListRoutes);
app.use("/warranty", warrantyRoutes);
app.use("/process", processTrakingRoutes);
app.use("/supplier", supplierRoutes);
app.use("/forwarder", forwarderRoutes);
app.use("/mail", mailRoutes);
app.use("/customer", customerRoutes);
app.use("/shipping-agent", shippingAgentRoutes);
app.use("/clearance-agent", clearanceAgentRoutes);
app.use("/warehouse", warehouseRoutes);
app.use("/file", fileRoutes);
/* -------------------------------------------------------------------------- */

/* ------------------------------ Root Route -------------------------------- */
app.get("/", (req, res) => {
  const clientIp = req.clientIp;
  res.send(`Your IP address is: ${clientIp}`);
});
/* -------------------------------------------------------------------------- */
setInterval(() => {
  updateStock();
  console.log("Stock Updated Successfully Hourly");
}, 60 * 60 * 1000);
/* ---------------------------- Database Setup ------------------------------ */
connect()
  .then(() => {
    console.log("Connected to the database");
    const PORT = process.env.PORT || 5000;
    // const PORT = 5001;

    app.listen(PORT, () => {
      console.log(`Server running on Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to connect to the database: ${error}`);
  });

mongoose.set("useFindAndModify", false);
/* -------------------------------------------------------------------------- */
