import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: {type : String},
  data: {type : Buffer},
  contentType: {type : String},
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SignedPiPDF', pdfSchema);
