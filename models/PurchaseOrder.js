import mongoose from "mongoose";
import Inc from "mongoose-sequence";
import { pklSchema } from "./schemas/pkl.js";
import { ciSchema } from "./schemas/ci.js";
import { blSchema } from "./schemas/bl.js";
import { productItemSchema } from "./schemas/product.js";
import { cooSchema } from "./schemas/coo.js";
import { statusSchema } from "./schemas/status.js";

const AutoIncrement = Inc(mongoose);

// Define the purchase order schema
const purchaseOrderSchema = mongoose.Schema(
  {
    date: { type: Date, required: true },
    exporter: { type: String, required: true },
    notifyParty: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    consignee: { type: String, required: true },
    portOfOrigin: { type: String, required: true },
    portOfDischarge: { type: String, required: true },
    products: {
      type: [productItemSchema],
      validate: {
        validator: function (value) {
          return value.length > 0; // At least one product item is required
        },
        message: "At least one product item is required.",
      },
    },
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
    totalBls: { type: Number },
    ETFP: { type: Date }, //The estimated time of finishing production
    caseNotes: { type: String },
    processStatus: [statusSchema],
    financialStatus: [statusSchema],
    po: {
      No: { type: String },
      filePath: { type: String },
    },
    pi: {
      No: { type: String },
      filePath: { type: String },
    },
    pkl: {
      No: { type: String },
      filePath: { type: String },
      info: pklSchema,
    },
    ci: {
      No: { type: String },
      filePath: { type: String },
      info: ciSchema,
    },
    bl: [blSchema],
    coo: {
      No: { type: String },
      info: cooSchema,
      filePath: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save hook to validate and handle errors
purchaseOrderSchema.pre("save", function (next) {
  if (this.totalAmount < 0) {
    const err = new Error("Total amount cannot be negative.");
    next(err);
  }
  // } else if (this.bl.length > 0 && !this.totalbls) {
  //   const err = new Error("Total BLs must be provided if BLs are present.");
  //   next(err);
  // }
  else {
    next();
  }
});

// Add auto-increment functionality to the "po_no" field
purchaseOrderSchema.plugin(AutoIncrement, {
  inc_field: "po_no",
  id: "poNums",
  start_seq: 60000,
});

// Create the PurchaseOrder model
var PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
