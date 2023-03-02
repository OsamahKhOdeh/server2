import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connect from "./config/db.js";
import { logRequest, setPoweredByHeader, errorHandler } from "./config/middleware.js";
import cors from "cors";
import productRoutes from "./routes/products.js";
import morgan from "morgan";
import { morganLogger } from "./utils/logger.js";
const app = express();
//app.use(logRequest);
app.use(setPoweredByHeader);
app.use(errorHandler);
//app.use(morgan("tiny"));
//app.use(morganLogger);

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = "mongodb+srv://osama:osamad12345@clusterags.l4fftvt.mongodb.net/ags?retryWrites=true&w=majority";
//const CONNECTION_URL = "mongodb+srv://test:osamad12345@practice.9rjaqen.mongodb.net/memories_app?retryWrites=true&w=majority";
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("App is running");
});

const PORT = 5000;
/*mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
*/
// Connect to the database
connect()
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
