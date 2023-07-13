import mongoose from "mongoose";

export const cooSchema = mongoose.Schema({
  cooNo: { type: String },
  countryOfOrigin: { type: String },
  serialNumber: { type: String },
  supplier: { supplierId: { type: String }, supplierName: { type: String } },
  customer: { customerId: { type: String }, customerName: { type: String } },
  consignee: { type: String },
  meansOfTransport: { type: String },
  route: { type: String },
  marksAndNumbersOfGoods: { type: String },
  HSCode: { type: String },
  Quantity: { type: String },
  invoiceNo: { type: String },
  invoiceDate: { type: String },
  address: { type: String },
  date: { type: String },
  totalGrossWeight: { type: Number },
  totalNetWeight: { type: Number },
});
