const mongoose = require("mongoose");

const faqSectionSchema = new mongoose.Schema(
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
    highlightedText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FaqSection = mongoose.model("FaqSection", faqSectionSchema);

module.exports = FaqSection;
