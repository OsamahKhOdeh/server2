import mongoose from "mongoose";
import { contactSchema } from "../schemas/contact.js";
import { addressSchema } from "../schemas/address.js";
const forwarderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    contact: [contactSchema],
    address: addressSchema,
    website: {
      type: String,
    },
    notes: {
      type: String,
    },
    communicationMethod: [
      {
        type: String,
      },
    ],
    etd: {
      type: Number,
    },
    freeStorageDuration: {
      type: Number,
    },

    transitTime: {
      type: Number,
    },
    costPerContainer: {
      type: Number,
    },
    availableContainerCount: {
      type: Number,
    },
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
  },
  {
    timestamps: true,
  }
);

const Forwarder = mongoose.model("Forwarder", forwarderSchema);

export default Forwarder;
