const mongoose = require("mongoose");

const featurePageCtaSchema = new mongoose.Schema(
  {
    title: {
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
      trim: true,
    },
    ctaText: {
      type: String,
      required: true,
      trim: true,
    },
    ctaLink: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeaturePageCta = mongoose.model("FeaturePageCta", featurePageCtaSchema);

module.exports = FeaturePageCta;
