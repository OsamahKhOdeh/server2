import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connect from "./config/db.js";
import { logRequest, setPoweredByHeader } from "./config/middleware.js";
import cors from "cors";
import productRoutes from "./routes/products.js";
import proformaInvoiceRoutes from "./routes/proformaInvoice.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import morgan from "morgan";
import { morganLogger } from "./utils/logger.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import * as dotenv from 'dotenv'

//import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config(); 
const app = express();
console.log(process.env.NODE_ENV);
app.use(logger)

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
app.use("/users",userRoutes)
app.use("/auth",authRoutes)

app.get("/", (req, res) => {
  res.send("App is running");
});

app.use(errorHandler)

const PORT = 5000;
/*mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
*/
// Connect to the database
connect()
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
