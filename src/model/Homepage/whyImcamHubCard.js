const mongoose = require("mongoose");

const whyImcamHubCardSchema = new mongoose.Schema(
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

const WhyImcamHubCard = mongoose.model("WhyImcamHubCard", whyImcamHubCardSchema);

module.exports = WhyImcamHubCard;
