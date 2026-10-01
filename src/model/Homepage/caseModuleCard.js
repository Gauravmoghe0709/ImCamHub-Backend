const mongoose = require("mongoose");

const caseModuleCardSchema = new mongoose.Schema(
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
    linkText: {
      type: String,
      required: true,
      trim: true,
    },
    linkUrl: {
      type: String,
      required: true,
      trim: true,
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

const CaseModuleCard = mongoose.model("CaseModuleCard", caseModuleCardSchema);

module.exports = CaseModuleCard;
