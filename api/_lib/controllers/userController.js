const bcrypt = require("bcryptjs");
const User = require("../models/User");

const listUsers = async (req, res) => {
  try {
    const users = await User.find({ tenantId: req.tenantId })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

const inviteUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      tenantId: req.tenantId,
      name,
      email,
      passwordHash,
      role: role === "staff" ? "staff" : "staff",
    });

    return res.status(201).json({
      id: user._id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(id) === String(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const user = await User.findOne({ _id: id, tenantId: req.tenantId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "owner") {
      return res
        .status(400)
        .json({ message: "Owner account cannot be deleted" });
    }

    await user.deleteOne();
    return res.json({ message: "User deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

module.exports = {
  listUsers,
  inviteUser,
  deleteUser,
};
