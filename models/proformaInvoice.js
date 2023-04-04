import mongoose from "mongoose";
import Inc from "mongoose-sequence";
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
  LocalPrice: { type: Number },
  LocalPriceAED : { type: Number},
  freezonePriceAED : { type: Number},
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
  additions : {type : Number},
  discount: { type: Number },
  products: [productSchema],
  employee : { type: String },
  user : { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status : {type : String , default : "Pending" },
  managerMessage : { type: String , default : ""},
  location : {type : String, default : "freezone" },
  currency : {type : String, default : "USD" },
  phone_number : {type : String, default : "+971"},
  bankDetails : [{type : String, default : ""}],
  note : {type : String, default : "No note"},
  terms : [{type : String, default : ""}]
},{
  timestamps: true
});
 
proformaInvoiceSchema.plugin(AutoIncrement, {
  inc_field: 'pi_no',
  id: 'piNums',
  start_seq: 40000
});

var ProformaInvoice = mongoose.model("ProformaInvoice", proformaInvoiceSchema);



export default ProformaInvoice;
