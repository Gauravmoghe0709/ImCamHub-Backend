const mongoose = require("mongoose");

const problemSolutionSectionSchema = new mongoose.Schema(
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
      required: true,
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
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ProblemSolutionSection = mongoose.model(
  "ProblemSolutionSection",
  problemSolutionSectionSchema
);

module.exports = ProblemSolutionSection;
