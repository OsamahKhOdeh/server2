import mongoose from "mongoose";

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
  LocalPrice: { type: Number },
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

const proformaInvoiceSchema = mongoose.Schema({
  no: { type: Number, index: true },
  date: { type: Date },
  exporter: { type: String },
  notify_party: { type: String },
  buyer_address: { type: String },
  consignee: { type: String },
  party_of_discharge: { type: String },
  final_distination: { type: String },
  discount: { type: Number },
  additions : {type : Number},
  products: [productSchema],
});

var ProformaInvoice = mongoose.model("ProformaInvoice", proformaInvoiceSchema);

export default ProformaInvoice;
