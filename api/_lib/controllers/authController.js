const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tenant = require("../models/Tenant");
const User = require("../models/User");

const buildUserPayload = (user) => ({
  id: user._id,
  tenantId: user.tenantId,
  name: user.name,
  email: user.email,
  role: user.role,
});

const generateAccessToken = (userPayload) => {
  return jwt.sign(userPayload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

const generateRefreshToken = (userPayload) => {
  return jwt.sign(userPayload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = async (req, res) => {
  try {
    const { firmName, address, gstin, mobile, name, email, password } =
      req.body;

    if (!firmName || !name || !email || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const tenant = await Tenant.create({
      firmName,
      address,
      gstin,
      mobile,
      email,
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      tenantId: tenant._id,
      name,
      email,
      passwordHash,
      role: "owner",
    });

    const payload = buildUserPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      accessToken,
      user: payload,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to register", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = buildUserPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: payload,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};

const refresh = (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const payload = {
      id: decoded.id,
      tenantId: decoded.tenantId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = generateAccessToken(payload);
    return res.json({ accessToken, user: payload });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.json({ message: "Logged out" });
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
