const mongoose = require("mongoose");

// Stats sub-schema for the array of statistics
const StatsSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
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
  { _id: false } // Disable _id for embedded documents
);

const SolutionsPageSectionSchema = new mongoose.Schema(
  {
    badge_text: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    highlighted_title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    background_image: {
      type: String,
    },
    stats: {
      type: [StatsSchema],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "stats must be a non-empty array",
      },
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    display_order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const SolutionsPageSection = mongoose.model(
  "SolutionsPageSection",
  SolutionsPageSectionSchema
);

module.exports = SolutionsPageSection;
