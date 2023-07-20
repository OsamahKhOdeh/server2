import mongoose from "mongoose";
import Inc from "mongoose-sequence";
import { statusSchema } from "./schemas/status.js";

const AutoIncrement = Inc(mongoose);

const productSchema = mongoose.Schema({
  category: { type: String, required: true },
  country: { type: String, required: true },
  company: { type: String, required: true },
  brand: { type: String, required: true },
  code: { type: String, required: true, index: true },
  description: { type: String },
  price: { type: Number },
  stock: { type: Number },
  freezonePrice: { type: Number },
  syriaPrice: { type: Number },
  LocalPrice: { type: Number },
  LocalPriceAED: { type: Number },
  freezonePriceAED: { type: Number },
  syriaPriceAED: { type: Number },
  datasheet: { type: String },
  capacity: { type: String, required: true },
  image: [{ type: String }],
  netWeight: { type: Number },
  grossWeight: { type: Number },
  palatSize: { type: Number },
  qty: { type: Number },

  bl: [
    {
      code: { type: String, index: true },
      qty: { type: Number },
      date: { type: String },
      warehouse: { type: String },
      serialNumbers: [{ type: String }],
      blStatus: { type: String },
      bookQty: { type: Number },
    },
  ],
});

const proformaInvoiceSchema = mongoose.Schema(
  {
    no: { type: Number, index: true },
    date: { type: Date },
    branch: { type: String, default: "DUBAI" },
    exporter: { type: String },
    notify_party: { type: String },
    buyer_address: { type: String },
    consignee: { type: String },
    party_of_discharge: { type: String },
    final_distination: { type: String },
    additions: { type: Number },
    additionsDescription: { type: String },
    discount: { type: Number },
    discountDescription: { type: String },
    products: [productSchema],
    employee: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Pending" },
    financiaApproval: { type: String, default: "Pending" },
    financeMessage: { type: String, default: "" },
    finance: { type: String, default: "" },
    managerApproval: { type: String, default: "Pending" },
    managerMessage: { type: String, default: "" },
    location: { type: String, default: "freezone" },
    currency: { type: String, default: "USD" },
    phone_number: { type: String, default: "+971" },
    bankDetails: [{ type: String, default: "" }],
    note: { type: String, default: "No note" },
    terms: [{ type: String, default: "" }],
    paymentPercentage: { type: String, default: "30" },
    documentCharges: { type: Number, default: 0 },
    deliveryDate: { type: String, default: "7" },
    manager: { type: String, default: "" },
    booked: [{}],
    stockStatus: { type: String, default: "notBooked" },
    processStatus: [statusSchema],
  },
  {
    timestamps: true,
  }
);

proformaInvoiceSchema.plugin(AutoIncrement, {
  inc_field: "pi_no",
  id: "piNums",
  start_seq: 40000,
});

var ProformaInvoice = mongoose.model("ProformaInvoice", proformaInvoiceSchema);

export default ProformaInvoice;
