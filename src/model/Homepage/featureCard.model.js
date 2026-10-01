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
      validate: {
        validator: Number.isInteger,
        message: "display_order must be an integer",
      },
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const FeatureCard = mongoose.model("FeatureCard", featureCardSchema);

module.exports = FeatureCard;
