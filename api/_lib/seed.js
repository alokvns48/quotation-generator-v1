require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Counter = require("./models/Counter");
const Customer = require("./models/Customer");
const Quotation = require("./models/Quotation");
const Tenant = require("./models/Tenant");
const User = require("./models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    Counter.deleteMany({}),
    Quotation.deleteMany({}),
    Customer.deleteMany({}),
    User.deleteMany({}),
    Tenant.deleteMany({}),
  ]);

  const tenant = await Tenant.create({
    firmName: "Panchavati Furniture",
    address: "Varanasi",
    gstin: "09DGDPD5475G1ZB",
    mobile: "8318000620",
    email: "admin@panchavati.com",
    businessDomain: "Furniture",
    headerSizes: {
      gstin: 18,
      mobile: 18,
      firmName: 46,
      address: 24,
      businessDomain: 13,
    },
    defaultGST: 18,
  });

  const owner = await User.create({
    tenantId: tenant._id,
    name: "Admin",
    email: "admin@panchavati.com",
    passwordHash: await bcrypt.hash("Admin@123", 10),
    role: "owner",
  });

  const customers = await Customer.insertMany([
    {
      tenantId: tenant._id,
      name: "Abhishek Kumar Vishwakarma",
      mobile: "8318000620",
      address: "UBI Jivnathpur Branch, Chandauli",
    },
    {
      tenantId: tenant._id,
      name: "Ramesh Singh",
      mobile: "9876543210",
      address: "12 Civil Lines, Varanasi",
    },
    {
      tenantId: tenant._id,
      name: "Sunita Devi",
      mobile: "9123456780",
      address: "Near Kashi Temple, Banaras",
    },
  ]);

  const q1Items = [
    {
      slNo: 1,
      particulars: "Neelkamal Dallaf",
      quantity: 1,
      unit: "pcs",
      rate: 20000,
      amount: 20000,
    },
    {
      slNo: 2,
      particulars: "Neelkamal Sofa",
      quantity: 1,
      unit: "pcs",
      rate: 26000,
      amount: 26000,
    },
    {
      slNo: 3,
      particulars: "Triveni Almirah",
      quantity: 1,
      unit: "pcs",
      rate: 32000,
      amount: 32000,
    },
  ];
  const q1Subtotal = q1Items.reduce((s, i) => s + i.amount, 0);
  const q1Gst = (q1Subtotal * 18) / 100;

  const q2Items = [
    {
      slNo: 1,
      particulars: "Office Chair",
      quantity: 4,
      unit: "pcs",
      rate: 5000,
      amount: 20000,
    },
    {
      slNo: 2,
      particulars: "Writing Table",
      quantity: 2,
      unit: "pcs",
      rate: 12000,
      amount: 24000,
    },
  ];
  const q2Grand = q2Items.reduce((s, i) => s + i.amount, 0);

  const q3Items = [
    {
      slNo: 1,
      particulars: "Dining Table",
      quantity: 1,
      unit: "pcs",
      rate: 18000,
      amount: 18000,
    },
    {
      slNo: 2,
      particulars: "Dining Chair",
      quantity: 6,
      unit: "pcs",
      rate: 3500,
      amount: 21000,
    },
  ];
  const q3Grand = q3Items.reduce((s, i) => s + i.amount, 0);

  await Quotation.insertMany([
    {
      tenantId: tenant._id,
      createdBy: owner._id,
      quotationNumber: "PVF/2026/0001",
      date: new Date("2026-01-05"),
      status: "sent",
      customer: {
        customerId: customers[0]._id,
        name: customers[0].name,
        mobile: customers[0].mobile,
        address: customers[0].address,
      },
      items: q1Items,
      taxConfig: { type: "exclusive", gstPercent: 18 },
      subtotal: q1Subtotal,
      gstAmount: q1Gst,
      grandTotal: q1Subtotal + q1Gst,
      notes: "",
    },
    {
      tenantId: tenant._id,
      createdBy: owner._id,
      quotationNumber: "PVF/2026/0002",
      date: new Date("2026-02-10"),
      status: "accepted",
      customer: {
        customerId: customers[1]._id,
        name: customers[1].name,
        mobile: customers[1].mobile,
        address: customers[1].address,
      },
      items: q2Items,
      taxConfig: { type: "inclusive", gstPercent: 18 },
      subtotal: q2Grand,
      gstAmount: 0,
      grandTotal: q2Grand,
      notes: "",
    },
    {
      tenantId: tenant._id,
      createdBy: owner._id,
      quotationNumber: "PVF/2026/0003",
      date: new Date("2026-03-20"),
      status: "draft",
      customer: {
        customerId: customers[2]._id,
        name: customers[2].name,
        mobile: customers[2].mobile,
        address: customers[2].address,
      },
      items: q3Items,
      taxConfig: { type: "none", gstPercent: 0 },
      subtotal: q3Grand,
      gstAmount: 0,
      grandTotal: q3Grand,
      notes: "",
    },
  ]);

  await Counter.create({
    tenantId: tenant._id,
    year: 2026,
    sequence: 3,
  });

  console.log("Seed data inserted successfully");
  await mongoose.disconnect();
};

if (require.main === module) {
  run().catch(async (error) => {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  });
}

module.exports = run;
