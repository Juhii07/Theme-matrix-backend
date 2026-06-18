const multer = require("multer");
const path   = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// ✅ Allow images AND zip/rar files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|zip|rar|gz|tar/
  const extName  = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = /image|zip|octet-stream|x-zip|x-rar/.test(file.mimetype)

  if (extName || mimeType) {
    cb(null, true)
  } else {
    cb("Only images and zip/rar files allowed!")
  }
}

const upload = multer({ storage });

module.exports = upload;