const mongoose = require("mongoose");

const platformSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      trim: true,
    },
    highlightedText: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dashboardImage: {
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

const PlatformSection = mongoose.model("PlatformSection", platformSectionSchema);

module.exports = PlatformSection;
