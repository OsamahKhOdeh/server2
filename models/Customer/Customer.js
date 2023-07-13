import mongoose from "mongoose";

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

const contactSchema = new mongoose.Schema({
  contactPersonName: {
    type: String,
  },
  phone: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
});

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    // required: true,
  },
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: [contactSchema],
  address: addressSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
