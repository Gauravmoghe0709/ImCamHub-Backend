const mongoose = require("mongoose");

const bookDemoFormSchema = new mongoose.Schema(
  {
    firmName: {
      type: String,
      required: [true, "Firm name is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    workEmail: {
      type: String,
      required: [true, "Work email is required"],
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    firmSize: {
      type: String,
      required: [true, "Firm size is required"],
      trim: true,
      enum: {
        values: [
          "1 - 10 employees",
          "11 - 50 employees",
          "51 - 200 employees",
          "201 - 1,000 employees",
          "1,000+ employees",
        ],
        message: "Please select a valid firm size",
      },
    },
    preferredDate: {
      type: Date,
      default: null,
    },
    preferredTime: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["New", "Contacted", "Scheduled", "Completed", "Cancelled"],
        message: "Please select a valid status",
      },
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const BookDemoForm = mongoose.model("BookDemoForm", bookDemoFormSchema);

module.exports = BookDemoForm;
