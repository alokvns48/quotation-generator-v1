const Tenant = require("../models/Tenant");

const getFirmProfile = async (req, res) => {
  try {
    const firm = await Tenant.findById(req.tenantId);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    return res.json(firm);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch firm", error: error.message });
  }
};

const updateFirmProfile = async (req, res) => {
  try {
    const allowedFields = [
      "firmName",
      "address",
      "gstin",
      "mobile",
      "email",
      "logoUrl",
      "businessDomain",
      "headerSizes",
      "defaultGST",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    const firm = await Tenant.findByIdAndUpdate(req.tenantId, updates, {
      new: true,
      runValidators: true,
    });

    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    return res.json(firm);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update firm", error: error.message });
  }
};

module.exports = {
  getFirmProfile,
  updateFirmProfile,
};
