const mongoose = require("mongoose");

const featureCardSchema = new mongoose.Schema(
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
    display_order: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FeatureCard = mongoose.model("FeatureCard", featureCardSchema);

module.exports = FeatureCard;
