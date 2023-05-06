import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const productItemSchema = mongoose.Schema({
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

const purchaseOrderSchema = mongoose.Schema(
  {
    date: { type: Date },
    exporter: { type: String },
    notifyParty: { type: String },
    buyerAddress: { type: String },
    consignee: { type: String },
    portOfOrigin: { type: String },
    portOfDischarge: { type: String },
    products: [productItemSchema],
    totalPcs: { type: Number, float: true, default: 0 },
    totalPallets: { type: Number, float: true, default: 0 },
    totalWeight: { type: Number, float: true, default: 0 },
    subTotalAmount: { type: Number, float: true, default: 0 },
    totalAmount: { type: Number, float: true, default: 0 },
    totalAmountInWords: { type: String, default: "" },
    employee: { type: String },
    status: { type: String, default: "draft" },
    financialStatus: { type: String, default: "not paid" },
    managerMessage: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    note: { type: String, default: "No note" },
    incoterms: [{ type: String, default: "" }],
    manager: { type: String, default: "" },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

purchaseOrderSchema.plugin(AutoIncrement, {
  inc_field: "po_no",
  id: "poNums",
  start_seq: 60000,
});

var PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
