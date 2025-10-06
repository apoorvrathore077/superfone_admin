// middleware/uploadDocuments.js
import multer from "multer";
import fs from "fs";
import path from "path";

const docDirs = path.join(process.cwd(), "uploads/kycDocuments");
if (!fs.existsSync(docDirs)) fs.mkdirSync(docDirs, { recursive: true });

export const uploadDocuments = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, docDirs),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
  })
}).array("documents", 10);
