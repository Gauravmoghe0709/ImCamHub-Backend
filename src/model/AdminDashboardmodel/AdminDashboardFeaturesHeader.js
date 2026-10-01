const mongoose = require("mongoose");

const adminDashboardFeaturesHeaderSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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

const AdminDashboardFeaturesHeader = mongoose.model(
  "AdminDashboardFeaturesHeader",
  adminDashboardFeaturesHeaderSchema
);

module.exports = AdminDashboardFeaturesHeader;
