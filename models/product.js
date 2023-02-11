import mongoose from "mongoose";
const productSchema = mongoose.Schema({
  category: { type: String, required: true },
  country: { type: String, required: true },
  company: { type: String, required: true },
  brand: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number },
  capacity: { type: String, required: true },
  image: { type: String },
  netWeight: { type: Number, required: true },
  grossWeight: { type: Number, required: true },
  palatSize: { type: Number, required: true },
  bl: [
    {
      code: { type: String, required: true },
      qty: { type: Number, required: true },
      date: { type: String, required: true },
      warehouse: { type: String },
    },
  ],
});

var Product = mongoose.model("Product", productSchema);

export default Product;
