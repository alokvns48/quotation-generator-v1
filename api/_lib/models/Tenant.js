const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    firmName: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    gstin: { type: String, default: "", trim: true },
    mobile: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    logoUrl: { type: String, default: "" },
    businessDomain: { type: String, default: "", trim: true },
    headerSizes: {
      gstin: { type: Number, default: 18, min: 10, max: 60 },
      mobile: { type: Number, default: 18, min: 10, max: 60 },
      firmName: { type: Number, default: 46, min: 20, max: 100 },
      address: { type: Number, default: 24, min: 12, max: 80 },
      businessDomain: { type: Number, default: 13, min: 10, max: 40 },
    },
    defaultGST: { type: Number, default: 18, min: 0, max: 100 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

module.exports = mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);
