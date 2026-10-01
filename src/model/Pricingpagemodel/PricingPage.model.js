const mongoose = require("mongoose");

const pricingPageSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pricingLabel: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PricingPage = mongoose.model("PricingPage", pricingPageSchema);

module.exports = PricingPage;
