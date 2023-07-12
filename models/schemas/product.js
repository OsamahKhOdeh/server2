import mongoose from "mongoose";

export const productItemSchema = mongoose.Schema({
  price: { type: Number, float: true },
  capacity: { type: String, default: "" },
  brand: { type: String, default: "" },
  category: { type: String, default: "" },
  code: { type: String, default: "" },
  company: { type: String, default: "" },
  country: { type: String, default: "" },
  palatSize: { type: Number, default: 8 },
  grossWeight: { type: Number, float: true },
  netWeight: { type: Number, float: true },
  weight: { type: Number, float: true },
  totalWeight: { type: Number, float: true, default: 0 },
  pcsInPallet: { type: Number, float: true, default: 0 },
  palletQty: { type: Number, float: true, default: 0 },
  qty: { type: Number, float: true, default: 0 },
  totalAmount: { type: Number, float: true, default: 0 },
  dimension: [{ type: String }],
  terminal: { type: String },
});
