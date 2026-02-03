const axios = require("axios");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../uploads/vehicles");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Download image from URL, convert to WEBP, save locally
 * @param {string} imageUrl
 * @returns {string} local image path (to store in DB)
 */
const downloadImage = async (imageUrl) => {
  try {
    // Validate URL
    if (!imageUrl || !imageUrl.startsWith("http")) {
      throw new Error("Invalid image URL");
    }

    // Fetch image
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "arraybuffer",
      timeout: 10000,
    });

    // Generate unique filename
    const fileName = `${Date.now()}.webp`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convert & save as WEBP
    await sharp(response.data)
      .resize(1200, 800, { fit: "inside" })
      .webp({ quality: 80 })
      .toFile(filePath);

    // Return relative path for DB
    return `/uploads/vehicles/${fileName}`;
  } catch (error) {
    console.error("Image download failed:", error.message);
    throw new Error("Failed to download image");
  }
};

module.exports = downloadImage;
