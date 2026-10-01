const mongoose = require("mongoose");

const bookDemoTestimonialSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: [true, "Quote is required"],
      trim: true,
    },
    authorName: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    authorRole: {
      type: String,
      required: [true, "Author role is required"],
      trim: true,
    },
    authorCompany: {
      type: String,
      required: [true, "Author company is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookDemoTestimonial = mongoose.model("BookDemoTestimonial", bookDemoTestimonialSchema);

module.exports = BookDemoTestimonial;
