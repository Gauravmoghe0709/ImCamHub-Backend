const mongoose = require("mongoose");

const CaseworkerPortalFaqHeaderSchema = new mongoose.Schema(
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

const CaseworkerPortalFaqHeader = mongoose.model(
  "CaseworkerPortalFaqHeader",
  CaseworkerPortalFaqHeaderSchema
);

module.exports = CaseworkerPortalFaqHeader;
