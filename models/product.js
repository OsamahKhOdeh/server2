import mongoose from "mongoose";
const productSchema = mongoose.Schema(
  {
    category: { type: String, required: true },
    country: { type: String, required: true },
    company: { type: String, required: true },
    brand: { type: String },
    code: { type: String, required: true, index: true },
    description: { type: String },
    price: { type: Number },
    stock: { type: Number },
    stockAll: [{}],
    booked: { type: Number },
    coming: { type: Number },
    lastUpdateBy: { type: String },
    freezonePrice: { type: Number },
    netPrice: { type: Number },
    syriaPrice: { type: Number },
    LocalPrice: { type: Number },
    datasheet: { type: String },
    capacity: { type: String, required: true },
    image: [{ type: String }],
    netWeight: { type: Number },
    grossWeight: { type: Number },
    palatSize: { type: Number },
    bl: [
      {
        code: { type: String, index: true },
        qty: { type: Number },
        date: { type: String },
        warehouse: { type: String },
        serialNumbers: [{ type: String }],
        status: { type: String },
        booked: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

var Product = mongoose.model("Product", productSchema);

export default Product;
