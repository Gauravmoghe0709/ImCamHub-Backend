const mongoose = require("mongoose");

const SponsorBusinessCtaSchema = new mongoose.Schema(
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
    buttonText: {
      type: String,
      required: true,
      trim: true,
    },
    buttonLink: {
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

const SponsorBusinessCta = mongoose.model(
  "SponsorBusinessCta",
  SponsorBusinessCtaSchema
);

module.exports = SponsorBusinessCta;
