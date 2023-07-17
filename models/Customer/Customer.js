import mongoose from "mongoose";
import { contactSchema } from "../schemas/contact.js";
import { addressSchema } from "../schemas/address.js";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    // required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
});

const financeAccountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    // required: true,
    // unique: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  payments: [paymentSchema],
});

const customerSchema = new mongoose.Schema(
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
    financeAccount: financeAccountSchema,
    promoCode: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalAmountBought: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    purchases: {
      type: Number,
      default: 0,
    },
    lastPurchaseDate: {
      type: Date,
      default: null,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    communicationMethod: [
      {
        type: String,
      },
    ],
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
