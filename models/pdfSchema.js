import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema(
  {
    name: { type: String },
    data: { type: Buffer },
    contentType: { type: String },
    pi_no: { type: String },
    employee: { type: String },
    manager: { type: String },
    pi_id: { type: String },
    status: { type: String, default: "CONFIRMED" },
    pi_done_status: { type: [String], default: ["CONFIRMED"] },
    buyer_address: { type: String },
    payments: { type: [String] },
    date: {
      type: Date,
      default: Date.now,
    },

    booked: [{}],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SignedPiPDF", pdfSchema);
