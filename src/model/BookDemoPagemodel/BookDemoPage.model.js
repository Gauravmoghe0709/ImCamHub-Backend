const mongoose = require("mongoose");

const bookDemoPageSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      trim: true,
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

const BookDemoPage = mongoose.model("BookDemoPage", bookDemoPageSchema);

module.exports = BookDemoPage;
