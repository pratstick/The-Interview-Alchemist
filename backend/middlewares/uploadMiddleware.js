const multer = require("multer");

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Set the filename to current timestamp + original name
    },
});

//FIle filter to allow only images

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]; // Allowed file types
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false); // Reject the file
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload; 