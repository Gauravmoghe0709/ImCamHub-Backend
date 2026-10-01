const mongoose = require("mongoose");

const SponsorBusinessHeroSchema = new mongoose.Schema(
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
    backgroundImage: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const SponsorBusinessHero = mongoose.model(
  "SponsorBusinessHero",
 SponsorBusinessHeroSchema
);

module.exports = SponsorBusinessHero;
