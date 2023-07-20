import multer from "multer";
import fs from "fs";
import { HOME_DIR } from "../../index.js";

const folderName = "60057_LONGI_SOLAR_TECHNOLOGY_Co.,Ltd_._2023-07-17_64b50c24321bcd2eacdc41e3";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("..............................");
    const { division, folderName } = req.body;
    console.log(req.body);
    console.log("..............................");
    const folderPath = HOME_DIR + `/${division}` + `/${folderName}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log("No Such Directory");
    } else {
      console.log("Directory already exists : " + folderName);
    }
    // if (!fs.existsSync("archive")) {
    //   fs.mkdirSync("archive", { recursive: true });
    // }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const { fileName, fileExtension, fileType, fileSize, isNew, id, fileNo } = req.body;
    // const caseName = req.body.caseName.replace(/ /g, "_");
    console.log({ fileName, fileExtension, fileType, fileSize, isNew, id });
    const savedFileName = `${fileType}_${fileNo}_${fileName}.${fileExtension}`;
    cb(null, savedFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadStorage = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: fileFilter,
});

export default uploadStorage;
