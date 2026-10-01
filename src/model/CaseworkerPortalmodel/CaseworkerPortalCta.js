const mongoose = require("mongoose");

const CaseworkerPortalCtaSchema = new mongoose.Schema(
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

const CaseworkerPortalCta = mongoose.model(
  "CaseworkerPortalCta",
  CaseworkerPortalCtaSchema
);

module.exports = CaseworkerPortalCta;
