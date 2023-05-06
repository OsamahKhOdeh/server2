import mongoose from "mongoose";

const POInfoSchema = new mongoose.Schema(
  {
    supplier: [{ type: String }],
    buyer: [{ type: String }],
    consignee: [{ type: String }],
    notifyParty: [{ type: String }],
    portOfOrigin: [{ type: String }],
    finalDestination: [{ type: String }],
    incoterm: [{ type: String }],
    currency: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("POInfo", POInfoSchema);
