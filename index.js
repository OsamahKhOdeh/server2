import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/products.js";
const app = express();

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

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
