const Counter = require("../models/Counter");
const Quotation = require("../models/Quotation");
const Tenant = require("../models/Tenant");

const sanitizePrefix = (firmName) => {
  const cleaned = (firmName || "QTN").replace(/[^a-z0-9]/gi, "").toUpperCase();
  return (cleaned.slice(0, 3) || "QTN").padEnd(3, "X");
};

const getNextQuotationNumber = async (tenantId) => {
  const year = new Date().getFullYear();

  const [tenant, counter] = await Promise.all([
    Tenant.findById(tenantId).select("firmName"),
    Counter.findOneAndUpdate(
      { tenantId, year },
      { $inc: { sequence: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    ),
  ]);

  const prefix = sanitizePrefix(tenant?.firmName);
  const sequence = String(counter.sequence).padStart(4, "0");

  return `${prefix}/${year}/${sequence}`;
};

const computeTotals = (items = [], taxConfig = {}) => {
  const normalizedItems = items.map((item, idx) => {
    const quantity = Number(item.quantity || 0);
    const rate = Number(item.rate || 0);
    const amount = quantity * rate;

    return {
      slNo: Number(item.slNo || idx + 1),
      particulars: item.particulars || "",
      quantity,
      unit: item.unit || "",
      rate,
      amount,
    };
  });

  const mode = taxConfig.type || "exclusive";
  const gstPercent = Number(taxConfig.gstPercent || 0);

  const baseSum = normalizedItems.reduce((sum, item) => sum + item.amount, 0);

  if (mode === "inclusive") {
    return {
      items: normalizedItems,
      taxConfig: { type: mode, gstPercent },
      subtotal: baseSum,
      gstAmount: 0,
      grandTotal: baseSum,
    };
  }

  if (mode === "none") {
    return {
      items: normalizedItems,
      taxConfig: { type: mode, gstPercent: 0 },
      subtotal: baseSum,
      gstAmount: 0,
      grandTotal: baseSum,
    };
  }

  const gstAmount = (baseSum * gstPercent) / 100;
  const grandTotal = baseSum + gstAmount;

  return {
    items: normalizedItems,
    taxConfig: { type: "exclusive", gstPercent },
    subtotal: baseSum,
    gstAmount,
    grandTotal,
  };
};

const normalizeCustomer = (customer = {}) => {
  const normalized = {
    name: customer.name || "",
    mobile: customer.mobile || "",
    address: customer.address || "",
  };

  if (customer.customerId) {
    normalized.customerId = customer.customerId;
  }

  return normalized;
};

const listQuotations = async (req, res) => {
  try {
    const { status, from, to, q } = req.query;
    const filter = { tenantId: req.tenantId };

    if (status) {
      filter.status = status;
    }

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [{ quotationNumber: regex }, { "customer.name": regex }];
    }

    const quotations = await Quotation.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(200);

    return res.json(quotations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch quotations", error: error.message });
  }
};

const createQuotation = async (req, res) => {
  try {
    const {
      date,
      letterNo,
      status,
      customer,
      items,
      taxConfig,
      notes,
      validUntil,
    } = req.body;

    if (!customer?.name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    const quotationNumber = await getNextQuotationNumber(req.tenantId);
    const totals = computeTotals(items, taxConfig);

    const quotation = await Quotation.create({
      tenantId: req.tenantId,
      createdBy: req.user.id,
      quotationNumber,
      date: date ? new Date(date) : new Date(),
      letterNo,
      status: status || "draft",
      customer: normalizeCustomer(customer),
      items: totals.items,
      taxConfig: totals.taxConfig,
      subtotal: totals.subtotal,
      gstAmount: totals.gstAmount,
      grandTotal: totals.grandTotal,
      notes,
      validUntil: validUntil ? new Date(validUntil) : undefined,
    });

    return res.status(201).json(quotation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create quotation", error: error.message });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    return res.json(quotation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch quotation", error: error.message });
  }
};

const updateQuotation = async (req, res) => {
  try {
    const existing = await Quotation.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!existing) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const {
      date,
      letterNo,
      status,
      customer,
      items,
      taxConfig,
      notes,
      validUntil,
    } = req.body;

    const hasItems = Array.isArray(items) && items.length > 0;
    const totals = computeTotals(
      hasItems ? items : existing.items,
      taxConfig || existing.taxConfig,
    );

    existing.date = date ? new Date(date) : existing.date;
    existing.letterNo = letterNo ?? existing.letterNo;
    existing.status = status ?? existing.status;
    existing.customer = customer
      ? normalizeCustomer(customer)
      : existing.customer;
    existing.items = totals.items;
    existing.taxConfig = totals.taxConfig;
    existing.subtotal = totals.subtotal;
    existing.gstAmount = totals.gstAmount;
    existing.grandTotal = totals.grandTotal;
    existing.notes = notes ?? existing.notes;
    existing.validUntil = validUntil
      ? new Date(validUntil)
      : existing.validUntil;

    await existing.save();
    return res.json(existing);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update quotation", error: error.message });
  }
};

const deleteQuotation = async (req, res) => {
  try {
    const deleted = await Quotation.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    return res.json({ message: "Quotation deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete quotation", error: error.message });
  }
};

const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["draft", "sent", "accepted", "rejected"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const quotation = await Quotation.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { status },
      { new: true },
    );

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    return res.json(quotation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update status", error: error.message });
  }
};

module.exports = {
  listQuotations,
  createQuotation,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
};
