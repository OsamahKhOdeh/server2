import mongoose from "mongoose";
const forwarderSchema = new mongoose.Schema({
  forwarderName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
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
  notes: {
    type: String,
  },
  communicationMethod: {
    type: String,
  },
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
});

const Forwarder = mongoose.model("Forwarder", forwarderSchema);

export default Forwarder;
