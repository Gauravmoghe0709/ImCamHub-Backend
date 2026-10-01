const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "displayOrder must be an integer",
      },
    },
  },
  { _id: false }
);

const footerContactSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
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

const FooterContact = mongoose.model("FooterContact", footerContactSchema);

module.exports = FooterContact;
