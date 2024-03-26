const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const sharp = require("../middleware/sharp-config");

const bookCtrl = require("../controllers/book");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestratingBooks);
router.get("/:id", bookCtrl.getOneBook);

router.post("/", auth, upload.single("image"), sharp, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.createRatingBook);

router.put("/:id", auth, upload.single("image"), sharp, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
