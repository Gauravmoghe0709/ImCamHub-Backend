const mongoose = require("mongoose");

const SolutionsFeatureCardSchema = new mongoose.Schema(
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
    image: {
      type: String,
      required: true,
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
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const SolutionsFeatureCard = mongoose.model(
  "SolutionsFeatureCard",
  SolutionsFeatureCardSchema
);

module.exports = SolutionsFeatureCard;
