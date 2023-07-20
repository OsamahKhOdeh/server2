import mongoose from "mongoose";

export const containerSchema = new mongoose.Schema({
  No: { type: String, required: true },
  type: { type: String, required: true },
  filePath: { type: String },
  serialNumbers: [{ type: String }], // Array to store serial numbers for each product
  products: [
    {
      productId: { type: String }, // If using separate product IDs
      name: { type: String, required: true }, // Product name
      quantity: { type: Number, required: true }, // Quantity of the product in the container
      serialNumbers: [{ type: String }], // Array to store serial numbers for each product
    },
  ],
  size: { type: String, required: true }, // E.g., 20ft, 40ft, 45ft, etc.
  tareWeight: { type: Number }, // Weight of the empty container
  maxPayloadWeight: { type: Number }, // Maximum allowed weight of cargo in the container
  maxVolume: { type: Number }, // Maximum volume capacity of the container
  sealNumbers: [{ type: String }], // Array to store multiple seal numbers
  customsDeclarationNo: { type: String }, // Custom declaration number associated with the container
  currentWeight: { type: Number }, // Current weight of the container (cargo + tare weight)
  currentVolume: { type: Number }, // Current volume occupied by cargo in the container
  lastInspectionDate: { type: Date }, // Date of the last inspection
  nextInspectionDate: { type: Date }, // Date of the next scheduled inspection
  inspectionStatus: { type: String }, // Status of the container inspection (e.g., passed, pending, failed)
  isAvailable: { type: Boolean, default: true }, // Indicates if the container is available for use
  inTransit: { type: Boolean, default: false }, // Indicates if the container is currently in transit
  location: {
    latitude: { type: Number }, // Latitude coordinate of the container's current location
    longitude: { type: Number }, // Longitude coordinate of the container's current location
    timestamp: { type: Date }, // Timestamp of when the location was last updated
  },
  notes: { type: String }, // Additional notes or remarks about the container
});
