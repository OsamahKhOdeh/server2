import mongoose from "mongoose";
import { contactSchema } from "../schemas/contact.js";
import { addressSchema } from "../schemas/address.js";
const shippingAgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: { type: String },
    contact: [contactSchema],
    address: addressSchema,
    balance: { type: Number, default: 0 },
    services: [
      {
        serviceName: { type: String },
        serviceCost: { type: Number },
      },
    ],
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
    notes: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ShippingAgent = mongoose.model("ShippingAgent", shippingAgentSchema);

export default ShippingAgent;
