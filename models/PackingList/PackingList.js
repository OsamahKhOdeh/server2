import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const truckItemSchema = mongoose.Schema({
  truckNo: { type: String, required: true },
  truckDriverName: { type: String },
  truckDriverTel: { type: String },
  truckNetWeight: { type: Number, required: true },
  truckNetWeightFake: { type: Number },

  truckGrossWeight: { type: Number, required: true },
  truckGrossWeightFake: { type: Number },

  truckTotalPackages: { type: Number, required: true },
  truckTotalAmount: { type: Number, required: true },
  truckTotalPallets: { type: Number },
  truckBls: { type: String },
  truckProductItems: [
    {
      productCode: { type: String, required: true },
      productGrossWeight: { type: Number },
      productGrossWeightFake: { type: Number },

      productNetWeight: { type: Number },
      productNetWeightFake: { type: Number },

      productId: { type: String },
      productPrice: { type: Number },
      productCategory: { type: String, required: true },
      productCapacity: { type: String, required: true },
      productBrand: { type: String, required: true },
      productQty: { type: Number, required: true },
      productPalletQty: { type: Number },
      productTotalNetWeightFake: { type: Number },

      productTotalNetWeight: { type: Number, required: true },
      productTotalGrossWeightFake: { type: Number },
      productTotalGrossWeight: { type: Number },

      productTotalAmount: { type: Number, required: true },
      productBl: [{ type: String }],
      productWarehouses: [{ warehouse: { type: String, required: true }, qty: { type: Number, required: true } }],
    },
  ],
});

const PackingListSchema = mongoose.Schema(
  {
    employee: { type: String, required: true },
    managerApproval: { type: String, default: "Pending" },
    managerMessage: { type: String, default: "" },
    manager: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    exporter: { type: String, required: true },
    pklTotalGrossWeight: { type: Number },
    pklTotalGrossWeightFake: { type: Number },
    pklTotalNetWeight: { type: Number },
    pklTotalNetWeightFake: { type: Number },
    pklTotalAmount: { type: Number },
    piNo: { type: Number, required: true },
    piId: { type: String },
    invoiceNo: { type: String, required: true },
    customer: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    truckItems: [truckItemSchema],
    pklStatus: { type: String, default: "inStock" },
    piCurrency: { type: String, default: "USD" },
  },
  { timestamps: true }
);
/*
// Add validation rules to the schema
PackingListSchema.path("invoiceNo").validate(function (value) {
  // exporter should be at least 3 characters long
  return value.length >= 3;
}, "invoiceNo must be at least 3 characters long.");
*/
PackingListSchema.plugin(AutoIncrement, {
  inc_field: "pklNo",
  id: "pklNums",
  start_seq: 70000,
});

var PackingList = mongoose.model("PackingList", PackingListSchema);

export default PackingList;
