const mongoose = require("mongoose");

const featuresSchema = new mongoose.Schema(
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

const Features = mongoose.model("Features", featuresSchema);

module.exports = Features;
