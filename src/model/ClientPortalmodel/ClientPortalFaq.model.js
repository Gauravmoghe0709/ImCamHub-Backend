const mongoose = require("mongoose");

const ClientPortalFaqSchema = new mongoose.Schema(
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

const ClientPortalFaq = mongoose.model(
  "ClientPortalFaq",
  ClientPortalFaqSchema
);

module.exports = ClientPortalFaq;
