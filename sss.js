import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connect from "./config/db.js";
import { logRequest, setPoweredByHeader } from "./config/middleware.js";
import cors from "cors";
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

import morgan from "morgan";
import { morganLogger } from "./utils/logger.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import * as dotenv from "dotenv";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { updateStock } from "./controllers/stockControllers/stockControllers.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from "fs";
import requestIp from "request-ip";

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

//import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config();
const app = express();
app.use(morgan("combined", { stream: accessLogStream }));

/* --- helmet  helps secure Express apps by setting HTTP response headers. --- */
app.use(helmet());
/* -------------------------------------------------------------------------- */

/* -------------------------- Reduce Fingerprinting ------------------------- */
app.disable("x-powered-by");
/* -------------------------------------------------------------------------- */

/* ----- Rate Limmeter Prevent brute-force attacks against authorization ---- */
const opts = {
  points: 5, // Number of requests allowed
  duration: 1, // Per second
};
const rateLimiter = new RateLimiterMemory(opts);
// Apply rate limiting middleware to all routes
app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip) // Use the client's IP address as the identifier
    .then(() => {
      // If rate limiting is successful, continue to the next middleware
      next();
    })
    .catch((err) => {
      // If rate limiting fails, send an error response
      res.status(429).send("Too Many Requests");
    });
});

/* -------------------------------------------------------------------------- */

console.log(process.env.NODE_ENV);
app.use(logger);
app.use(requestIp.mw());

//app.use(logRequest);
app.use(setPoweredByHeader);
//app.use(morgan("tiny"));
//app.use(morganLogger);

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

const CONNECTION_URL = "mongodb+srv://osama:osamad12345@clusterags.l4fftvt.mongodb.net/ags?retryWrites=true&w=majority";
//const CONNECTION_URL = "mongodb+srv://test:osamad12345@practice.9rjaqen.mongodb.net/memories_app?retryWrites=true&w=majority";
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

app.get("/", (req, res) => {
  const clientIp = req.clientIp;
  res.send(`Your IP address is: ${clientIp}`);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });
//var upload = multer({ dest: "../public/uploads/" });

// Single file
app.post("/upload", uploadStorage.single("file"), async (req, res) => {
  console.log(req.file);

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

app.get("/download/:filename", (req, res) => {
  const filePath = __dirname + "/uploads/" + req.params.filename + ".pdf";
  console.log(filePath);
  res.download(
    filePath,
    `${req.params.filename}.pdf`, // Remember to include file extension
    (err) => {
      if (err) {
        res.send({
          error: err,
          msg: "Problem downloading the file",
        });
      }
    }
  );
});

app.use(errorHandler);

setInterval(() => {
  updateStock();
  console.log("Stock Updated Successfully Hourly");
}, 60 * 60 * 1000);

const PORT = 5000;
/*mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
*/
// Connect to the database
connect()
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
