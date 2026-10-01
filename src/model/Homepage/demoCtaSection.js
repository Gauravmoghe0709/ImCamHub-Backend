const mongoose = require("mongoose");

const demoCtaSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
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
    ctaButton: {
      type: String,
      required: true,
      trim: true,
    },
    ctaLink: {
      type: String,
      required: true,
      trim: true,
    },
    backgroundImage: {
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

const DemoCtaSection = mongoose.model("DemoCtaSection", demoCtaSectionSchema);

module.exports = DemoCtaSection;
