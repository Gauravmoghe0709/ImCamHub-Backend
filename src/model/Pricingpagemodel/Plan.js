const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
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
    displayOrder: {
      type: Number,
      required: [true, "Display order is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
