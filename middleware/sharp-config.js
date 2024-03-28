const multer = require("multer");
const sharp = require("sharp");
module.exports = async (req, res, next) => {
  if (typeof req.file !== "undefined") {
    const { buffer, originalname } = req.file;
    const timestamp = Date.now();
    req.file.filename = `${originalname}-${timestamp}.webp`;
    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile("./images/" + req.file.filename);
  }

  next();
};
