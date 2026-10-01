const mongoose = require("mongoose");

const whatToExpectSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    imageFileId: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const WhatToExpect = mongoose.model("WhatToExpect", whatToExpectSchema);

module.exports = WhatToExpect;
