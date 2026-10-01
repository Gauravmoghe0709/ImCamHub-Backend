const mongoose = require("mongoose");

const ctaSchema = new mongoose.Schema(
  {
    buttonText: {
      type: String,
      required: [true, "Button text is required"],
      trim: true,
    },
    buttonLink: {
      type: String,
      required: [true, "Button link is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CTA = mongoose.model("CTA", ctaSchema);

module.exports = CTA;
