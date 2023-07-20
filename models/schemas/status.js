import mongoose from "mongoose";

export const statusSchema = mongoose.Schema({
  status: { type: String, default: "STARTED" },
  statusIndex: { type: Number, default: 0 },
  startTime: { type: Date, default: new Date() },
  endTime: { type: Date, default: new Date() },
  duration: { type: Number, default: 0 },
  notes: [{ type: String }],
});
