import mongoose from "mongoose";

const SerialNumberSchema = new mongoose.Schema(
  {
    SN: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SerialNumber", SerialNumberSchema);
