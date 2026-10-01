const mongoose = require("mongoose");

const finalCtaSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "Heading is required"],
      trim: true,
    },
    highlighted_text: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    button_text: {
      type: String,
      required: [true, "Button text is required"],
      trim: true,
    },
    button_link: {
      type: String,
      required: [true, "Button link is required"],
      trim: true,
    },
    background_image: {
      type: String,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("PricingpageFinalCta", finalCtaSchema);
