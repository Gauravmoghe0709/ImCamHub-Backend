const mongoose = require("mongoose");

const footerLogoSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FooterLogo = mongoose.model("FooterLogo", footerLogoSchema);

module.exports = FooterLogo;
