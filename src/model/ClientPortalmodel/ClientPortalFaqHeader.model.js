const mongoose = require("mongoose");

const ClientPortalFaqHeaderSchema = new mongoose.Schema(
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

const ClientPortalFaqHeader = mongoose.model(
  "ClientPortalFaqHeader",
  ClientPortalFaqHeaderSchema
);

module.exports = ClientPortalFaqHeader;
