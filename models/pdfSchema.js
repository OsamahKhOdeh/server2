import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: {type : String},
  data: {type : Buffer},
  contentType: {type : String},
  pi_no : {type : String},
  pi_employee : {type : String},
  pi_manager : {type : String},
  pi_id : {type : String},
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SignedPiPDF', pdfSchema);
