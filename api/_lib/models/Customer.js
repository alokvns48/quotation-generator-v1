const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

customerSchema.index({ tenantId: 1, name: 1 });

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
