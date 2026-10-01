const mongoose = require("mongoose");

const caseManagementSectionSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    highlightedTitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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

const CaseManagementSection = mongoose.model(
  "CaseManagementSection",
  caseManagementSectionSchema
);

module.exports = CaseManagementSection;
