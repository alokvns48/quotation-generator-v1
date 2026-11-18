const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    year: { type: Number, required: true },
    sequence: { type: Number, default: 0 },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

counterSchema.index({ tenantId: 1, year: 1 }, { unique: true });

module.exports = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
