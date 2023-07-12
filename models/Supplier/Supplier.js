import mongoose from "mongoose";
const supplierSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  city: {
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
  contactPerson: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
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
    },
  ],
  logo: {
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
  communicationMethod: {
    type: String,
  },
});

// Create the Supplier model
const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
