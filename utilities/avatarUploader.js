const fs = require("fs");
const createHttpError = require("http-errors");
const multer = require("multer");
const path = require("path");
const uploader = ({ uploadFilepath, uploadType, uploadSize, uploadingError }) => {
   const uploadUrl = path.join(__dirname, `../public/uploads/${uploadFilepath}`);

   // Ensure the directory exists or create it
   if (!fs.existsSync(uploadUrl)) {
      fs.mkdirSync(uploadUrl, { recursive: true });
   }

   const storage = multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, uploadUrl);
      },
      filename: (req, file, cb) => {
         let extname = path.extname(file.originalname);
         const upload_filename = file.originalname.replace(extname, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
         cb(null, upload_filename + extname);
      },
   });

   const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
         if (uploadType.includes(file.mimetype)) {
            cb(null, true);
         } else {
            createHttpError(400, "invalid file type");
         }
      },
      limits: { fileSize: uploadSize },
   });

   return upload;
};
module.exports = uploader;
