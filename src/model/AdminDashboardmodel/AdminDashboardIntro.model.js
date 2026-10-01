const mongoose = require("mongoose");

const adminDashboardIntroSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description1: {
      type: String,
      required: true,
      trim: true,
    },
    description2: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminDashboardIntro = mongoose.model(
  "AdminDashboardIntro",
  adminDashboardIntroSchema
);

module.exports = AdminDashboardIntro;
