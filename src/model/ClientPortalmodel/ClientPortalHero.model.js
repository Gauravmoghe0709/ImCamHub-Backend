const mongoose = require("mongoose");

const ClientPortalHeroSchema = new mongoose.Schema(
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

const ClientPortalHero = mongoose.model(
  "ClientPortalHero",
 ClientPortalHeroSchema
);

module.exports = ClientPortalHero;
