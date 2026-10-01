const mongoose = require("mongoose");

const OurSolutionsCardsSchema = new mongoose.Schema(
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
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const OurSolutionsCards = mongoose.model(
  "OurSolutionsCards",
  OurSolutionsCardsSchema
);

module.exports = OurSolutionsCards;
