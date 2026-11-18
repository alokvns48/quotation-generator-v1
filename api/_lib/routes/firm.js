const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  getFirmProfile,
  updateFirmProfile,
} = require("../controllers/firmController");

const router = express.Router();

router.use(verifyToken);
router.get("/", getFirmProfile);
router.put("/", updateFirmProfile);

module.exports = router;
