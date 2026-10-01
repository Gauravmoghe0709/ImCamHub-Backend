const mongoose = require("mongoose");

const caseManagementFeatureCardSchema = new mongoose.Schema(
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
    tags: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "displayOrder must be an integer",
      },
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CaseManagementFeatureCard = mongoose.model(
  "CaseManagementFeatureCard",
  caseManagementFeatureCardSchema
);

module.exports = CaseManagementFeatureCard;
