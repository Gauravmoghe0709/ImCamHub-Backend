const mongoose = require("mongoose");

const footerLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "displayOrder must be an integer",
      },
    },
  },
  { _id: false }
);

const footerProductSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
      trim: true,
    },
    links: {
      type: [footerLinkSchema],
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

const FooterProduct = mongoose.model("FooterProduct", footerProductSchema);

module.exports = FooterProduct;
