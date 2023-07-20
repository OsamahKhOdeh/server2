import multer from "multer";
import uploadStorage from "./multerConfig.js";
import { HOME_DIR } from "../../index.js";
import PurchaseOrder from "../../models/PurchaseOrder.js";

export const uploadFile = async (req, res) => {
  // Use the uploadStorage middleware to handle file upload
  uploadStorage.single("file")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      return res.status(400).json({ message: "Multer error occurred", error: err });
    } else if (err) {
      // Other error occurred
      return res.status(500).json({ message: "Internal server error", error: err });
    }

    // File uploaded successfully
    // Access the uploaded file via req.file and perform further processing
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { fileName, fileExtension, fileType, fileSize, isNew, id, division, folderName, fileNo } = req.body;
    const folderPath = HOME_DIR + `/${division}` + `/${folderName}`;
    const filePath = `${folderPath}/${fileName}_${fileType}.${fileExtension}`;
    switch (division) {
      case "po":
        const updatedFields = {};
        updatedFields[`${fileType}.filePath`] = filePath;
        updatedFields[`${fileType}.No`] = fileNo;
        if (fileType === "bl") {
          const blObject = { No: fileNo, filePath: filePath };
          const updatedDoc = await PurchaseOrder.findByIdAndUpdate(id, { $push: { bl: blObject } }, { new: true });
          console.log(updatedDoc);
        } else {
          const updatedDoc = await PurchaseOrder.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
          console.log(updatedDoc);
        }
        break;
      // Add other cases for different divisions if needed

      default:
        // Handle the default case if division doesn't match any specific case
        break;
    }

    // Return a success response
    return res.status(200).json({ message: "File uploaded successfully" });
  });
};
