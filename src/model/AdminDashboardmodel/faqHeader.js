const mongoose = require("mongoose");

const faqHeaderSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const FaqHeader = mongoose.model("AdminDashboardFaqHeader", faqHeaderSchema);

module.exports = FaqHeader;
