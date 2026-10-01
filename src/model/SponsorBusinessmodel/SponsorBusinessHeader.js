const mongoose = require("mongoose");

const SponsorBusinessHeaderSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const SponsorBusinessHeader = mongoose.model(
  "SponsorBusinessHeader",
  SponsorBusinessHeaderSchema
);

module.exports = SponsorBusinessHeader;
