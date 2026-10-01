const mongoose = require("mongoose");

const pricingPageHeaderSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const PricingPageHeader = mongoose.model("PricingPageHeader", pricingPageHeaderSchema);

module.exports = PricingPageHeader;
