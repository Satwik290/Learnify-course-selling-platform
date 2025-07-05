const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, "src/uploads"); // ✅ This saves to /server/src/uploads
},
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `thumbnail-${Date.now()}${ext}`);
  },
});

exports.upload = multer({ storage });
