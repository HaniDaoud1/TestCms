const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Stockage Cloudinary avec configuration dynamique
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "posts",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
    transformation: [
      { width: 1920, height: 1080, crop: "limit", quality: "auto:best" },
    ],
  }),
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
