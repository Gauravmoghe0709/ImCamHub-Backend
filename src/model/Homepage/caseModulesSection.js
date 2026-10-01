const mongoose = require("mongoose");

const caseModulesSectionSchema = new mongoose.Schema(
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

const CaseModulesSection = mongoose.model(
  "CaseModulesSection",
  caseModulesSectionSchema
);

module.exports = CaseModulesSection;
