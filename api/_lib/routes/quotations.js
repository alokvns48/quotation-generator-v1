const express = require("express");
const { verifyToken } = require("../middleware/auth");
const {
  listQuotations,
  createQuotation,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
} = require("../controllers/quotationController");

const router = express.Router();

router.use(verifyToken);
router.get("/", listQuotations);
router.post("/", createQuotation);
router.get("/:id", getQuotationById);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);
router.patch("/:id/status", updateQuotationStatus);

module.exports = router;
