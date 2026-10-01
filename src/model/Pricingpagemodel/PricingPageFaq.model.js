const mongoose = require("mongoose");

const pricingPageFaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PricingPageFaq = mongoose.model("PricingPageFaq", pricingPageFaqSchema);

module.exports = PricingPageFaq;
