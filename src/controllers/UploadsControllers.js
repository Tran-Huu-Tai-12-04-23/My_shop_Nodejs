const multer = require("multer");
const appRoot = require("app-root-path");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    console.log(appRoot);
    cb(null, appRoot + "\\src\\resourse\\public\\uploads");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.username + "_avatar" + ".jpg");
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

const upload = multer({
  storage: storage,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + ".jpg");
  },
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      "Error: File upload only supports the " +
        "following filetypes - " +
        filetypes
    );
  },

  // mypic is the name of file attribute
});

module.exports = upload;
