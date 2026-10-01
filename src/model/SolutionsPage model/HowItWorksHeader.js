const mongoose = require("mongoose");

const HowItWorksHeaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    highlighted_text: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const HowItWorksHeader = mongoose.model(
  "HowItWorksHeader",
  HowItWorksHeaderSchema
);

module.exports = HowItWorksHeader;
