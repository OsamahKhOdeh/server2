import mongoose from "mongoose";
import { contactSchema } from "../schemas/contact.js";
import { addressSchema } from "../schemas/address.js";

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: addressSchema,
    // required: true,
  },
  capacity: {
    type: Number,
    // required: true,
  },
  services: [
    {
      serviceName: { type: String },
      serviceCost: { type: Number },
    },
  ],
  availableSpace: {
    type: Number,
    //  required: true,
  },
  contact: [contactSchema],

  active: {
    type: Boolean,
    default: true,
  },
  operatingHours: {
    from: {
      type: String,
      // required: true,
    },
    to: {
      type: String,
      // required: true,
    },
  },

  image: {
    type: String,
  },

  notes: {
    type: String,
  },
  website: {
    type: String,
  },
  balance: { type: Number, default: 0 },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;
