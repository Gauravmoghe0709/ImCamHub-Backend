const mongoose = require("mongoose");

const CaseworkerPortalFaqSchema = new mongoose.Schema(
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

const CaseworkerPortalFaq = mongoose.model(
  "CaseworkerPortalFaq",
  CaseworkerPortalFaqSchema
);

module.exports = CaseworkerPortalFaq;
