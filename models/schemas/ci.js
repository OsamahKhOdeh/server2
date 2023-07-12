import mongoose from "mongoose";

export const ciSchema = mongoose.Schema({
  ciNo: { type: String },
  supplier: { supplierId: { type: String }, supplierName: { type: String } },
  customer: { customerId: { type: String }, customerName: { type: String } },
  invoiceNo: { type: String },
  address: { type: String },
  date: { type: String },
  deliveryTerms: { type: String },
  shippedFrom: { type: String },
  ShippedTo: { type: String },
  SCNo: { type: String },
  countryOfOrigin: { type: String },
  paymentTerms: { type: String },
  poNo: { type: String },
  payment: { type: String },
  products: [
    {
      currency: { type: String },
      unitPrice: { type: Number },
      productId: { type: String },
      productCode: { type: String },
      procuctCategory: { type: String },
      productDescription: { type: String },
      qty: { type: Number },
      amount: { type: Number },
    },
  ],
  discount: { type: Number },
  vat: { type: Number },
  totalAmount: { type: Number },
  totalAmountInWords: { type: String },
  totalPackages: { type: Number },

  bankDetails: {
    beneficial: { type: String },
    banKNamed: { type: String },
    swiftId: { type: String },
    address: { type: String },
    accountNo: { type: String },
    branchNo: { type: String },
  },
});
