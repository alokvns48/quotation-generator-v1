const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema(
  {
    slNo: { type: Number, required: true },
    particulars: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "", trim: true },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const quotationCustomerSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const quotationTaxConfigSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["exclusive", "inclusive", "none"],
      default: "exclusive",
      required: true,
    },
    gstPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false },
);

const quotationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quotationNumber: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    letterNo: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected"],
      default: "draft",
      index: true,
    },
    customer: { type: quotationCustomerSchema, required: true },
    items: {
      type: [quotationItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one quotation item is required",
      },
    },
    taxConfig: { type: quotationTaxConfigSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    gstAmount: { type: Number, required: true, min: 0, default: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    notes: { type: String, default: "", trim: true },
    validUntil: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

quotationSchema.index({ tenantId: 1, quotationNumber: 1 }, { unique: true });
quotationSchema.index({ tenantId: 1, date: -1 });
quotationSchema.index({ tenantId: 1, status: 1, date: -1 });

module.exports = mongoose.models.Quotation || mongoose.model("Quotation", quotationSchema);
