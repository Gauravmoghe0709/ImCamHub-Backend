const mongoose = require("mongoose");

const problemSolutionComparisonSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
      trim: true,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
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

const ProblemSolutionComparison = mongoose.model(
  "ProblemSolutionComparison",
  problemSolutionComparisonSchema
);

module.exports = ProblemSolutionComparison;
