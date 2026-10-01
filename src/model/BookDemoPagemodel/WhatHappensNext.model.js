const mongoose = require("mongoose");

const whatHappensNextSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
    },
    steps: {
      type: [
        {
          text: {
            type: String,
            required: [true, "Step text is required"],
            trim: true,
          },
        },
      ],
      required: [true, "Steps array is required"],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0;
        },
        message: "At least one step is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

const WhatHappensNext = mongoose.model("WhatHappensNext", whatHappensNextSchema);

module.exports = WhatHappensNext;
