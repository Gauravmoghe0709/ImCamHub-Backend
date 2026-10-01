const mongoose = require("mongoose");

const SponsorBusinessFaqHeaderSchema = new mongoose.Schema(
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

const SponsorBusinessFaqHeader = mongoose.model(
  "SponsorBusinessFaqHeader",
  SponsorBusinessFaqHeaderSchema
);

module.exports = SponsorBusinessFaqHeader;
