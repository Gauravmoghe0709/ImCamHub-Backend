const mongoose = require("mongoose");

const dashboardSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dashboardImage: {
      type: String,
      default: null,
      trim: true,
    },
    heroVideo: {
      type: String,
      default: null,
      trim: true,
    },
    primaryButtonText: {
      type: String,
      required: true,
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryButtonText: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryButtonLink: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DashboardSection = mongoose.model("DashboardSection", dashboardSectionSchema);

module.exports = DashboardSection;
