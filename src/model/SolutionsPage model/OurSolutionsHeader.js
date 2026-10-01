const mongoose = require("mongoose");

const OurSolutionsHeaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    highlighted_text: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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

const OurSolutionsHeader = mongoose.model(
  "OurSolutionsHeader",
  OurSolutionsHeaderSchema
);

module.exports = OurSolutionsHeader;
