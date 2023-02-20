import mongoose from "mongoose";
const productSchema = mongoose.Schema({
  category: { type: String, required: true },
  country: { type: String, required: true },
  company: { type: String, required: true },
  brand: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  capacity: { type: String, required: true },
  image: { type: String },
  netWeight: { type: Number },
  grossWeight: { type: Number },
  palatSize: { type: Number },
  bl: [
    {
      code: { type: String },
      qty: { type: Number },
      date: { type: String },
      warehouse: { type: String },
    },
  ],
});

var Product = mongoose.model("Product", productSchema);

export default Product;
