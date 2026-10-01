const mongoose = require("mongoose");

const whyImcamHubSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    highlightedTitle: {
      type: String,
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

const WhyImcamHubSection = mongoose.model(
  "WhyImcamHubSection",
  whyImcamHubSectionSchema
);

module.exports = WhyImcamHubSection;
