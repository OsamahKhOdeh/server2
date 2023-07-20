import mongoose from "mongoose";
import { contactSchema } from "../schemas/contact.js";
import { addressSchema } from "../schemas/address.js";
const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: [contactSchema],
    address: addressSchema,
    //  address: addressSchema,
    // address: {
    //   type: String,
    //   // required: true,
    // },
    // city: {
    //   type: String,
    //   // required: true,
    // },
    // country: {
    //   type: String,
    //   required: true,
    // },
    // postalCode: {
    //   type: String,
    //   // required: true,
    // },
    // contactPerson: {
    //   type: String,
    //   required: true,
    // },
    // contactEmail: {
    //   type: String,
    //   required: true,
    // },
    // contactPhone: {
    //   type: String,
    //   required: true,
    // },

    email: { type: String },
    website: {
      type: String,
    },
    taxID: {
      type: String,
    },
    paymentTerms: {
      type: String,
    },
    //   accountNumber: {
    //     type: String,
    //   },
    productCategories: [{ type: String }],
    bankAccount: [
      {
        currency: {
          type: String,
          required: true,
        },
        bankName: {
          type: String,
          required: true,
        },
        accountNumber: {
          type: String,
          required: true,
        },
        swiftBIC: {
          type: String,
          // required: true,
        },
        IFSCCode: { type: String },
      },
    ],
    image: {
      type: String,
    },

    notes: {
      type: String,
    },
    cashBackTerms: {
      marketing: {
        percentage: { type: Number },
        maxAmount: { type: Number },
      },
      goods: [
        {
          from: { type: Number },
          to: { type: Number },
          percentage: { type: Number },
        },
      ],
    },
    communicationMethod: [
      {
        type: String,
      },
    ],
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

// Create the Supplier model
const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
