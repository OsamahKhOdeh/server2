import mongoose from "mongoose";

export const blSchema = mongoose.Schema({
  blNo: { type: String },
  shippingLine: { type: String },
  shipper: { type: String },
  consignee: { type: String },
  notifyParty: { type: String },
  forwarder: {
    forwarderId: { type: String },
    forwarderName: { type: String },
  },
  shippingAgent: { type: String },
  vesselNo: { type: String },
  voyageNo: { type: String },
  portOfLoading: { type: String },
  placeOfReceipt: { type: String },
  portOfDischarge: { type: String },
  placeOfDelivery: { type: String },
  numOfContainers: { type: Number },
  numberOfPallets: { type: Number },
  grossWeight: { type: Number },
  measurment: { type: Number },
  containers: [
    {
      containerNo: { type: String },
      containerType: { type: String },
      containerSealNumber: { type: String },
      containerPayloadUnitqty: { type: Number },
      payloadUnitType: { type: String },
      containerMeasurement: { type: Number },
      containerGrossWeight: { type: Number },
      containerTareWeight: { type: Number },
      goodsDescription: { type: String },
    },
  ],

  freightPayableAt: { type: String },
  ladenOnBoardDate: { type: Date },
  dateOfIssue: { type: Date },
  placeOfIssue: { type: String },
});
