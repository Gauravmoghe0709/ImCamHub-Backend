const mongoose = require("mongoose");

const SponsorBusinessContentSchema = new mongoose.Schema(
  {
    badge_text: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    secondary_description: {
      type: String,
      trim: true,
    },
    hero_image: {
      type: String,
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

const SponsorBusinessContent = mongoose.model(
  "SponsorBusinessContent",
  SponsorBusinessContentSchema
);

module.exports = SponsorBusinessContent;
