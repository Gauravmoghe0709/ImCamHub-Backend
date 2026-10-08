const mongoose = require("mongoose");

const pricingCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    features: {
      type: [String],
      required: [true, "Features array is required"],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0 && arr.length <= 5;
        },
        message: "Features must contain between 1 and 5 items",
      },
    },
  },
  { _id: true }
);

const pricingCardSchema = new mongoose.Schema(
  {
    // Plan Fields
    planName: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
    },
    billingPeriod: {
      type: String,
      required: [true, "Billing period is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    highlightedText: {
      type: String,
      trim: true,
      default: "",
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    popularText: {
      type: String,
      trim: true,
      default: "",
    },

    // CTA Fields
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

    // Categories with independent features
    categories: {
      type: [pricingCategorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const PricingCard = mongoose.model("PricingCard", pricingCardSchema);

module.exports = PricingCard;
