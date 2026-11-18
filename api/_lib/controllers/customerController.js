const Customer = require("../models/Customer");

const listCustomers = async (req, res) => {
  try {
    const { q = "" } = req.query;
    const query = { tenantId: req.tenantId };

    if (q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [{ name: regex }, { mobile: regex }, { address: regex }];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    return res.json(customers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch customers", error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customer = await Customer.create({
      tenantId: req.tenantId,
      name,
      mobile,
      address,
    });

    return res.status(201).json(customer);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create customer", error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { name, mobile, address },
      { new: true, runValidators: true },
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.json(customer);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update customer", error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.json({ message: "Customer deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete customer", error: error.message });
  }
};

module.exports = {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
