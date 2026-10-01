const mongoose = require("mongoose");

const SponsorBusinessFaqSchema = new mongoose.Schema(
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

const SponsorBusinessFaq = mongoose.model(
  "SponsorBusinessFaq",
  SponsorBusinessFaqSchema
);

module.exports = SponsorBusinessFaq;
