const mongoose = require("mongoose");

const HowItWorksProcessSchema = new mongoose.Schema(
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
    step_number: {
      type: String,
      required: true,
      trim: true,
      enum: ["01", "02", "03"],
      unique: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    display_order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const HowItWorksProcess = mongoose.model(
  "HowItWorksProcess",
  HowItWorksProcessSchema
);

module.exports = HowItWorksProcess;
