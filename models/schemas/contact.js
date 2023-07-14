import mongoose from "mongoose";
export const contactSchema = new mongoose.Schema({
  contactPersonName: {
    type: String,
  },
  phone: {
    type: String,
    // required: true,
  },
  officePhone: {
    type: String,
  },
  email: {
    type: String,
    // required: true,
  },
});
