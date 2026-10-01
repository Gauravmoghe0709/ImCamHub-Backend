const { isValidObjectId } = require("mongoose");
const BookDemoTestimonial = require("../../model/BookDemoPagemodel/BookDemoTestimonial.model");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeTestimonial = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    quote: record.quote || "",
    authorName: record.authorName || "",
    authorRole: record.authorRole || "",
    authorCompany: record.authorCompany || "",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      return field;
    }
  }
  return null;
};

/**
 * Create Testimonial
 * @route POST /admin/book-demo/testimonial
 * @access Admin (Protected)
 */
async function createTestimonial(req, res) {
  try {
    const requiredFields = ["quote", "authorName", "authorRole", "authorCompany"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const testimonial = await BookDemoTestimonial.create({
      quote: normalizeText(req.body.quote),
      authorName: normalizeText(req.body.authorName),
      authorRole: normalizeText(req.body.authorRole),
      authorCompany: normalizeText(req.body.authorCompany),
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: sanitizeTestimonial(testimonial),
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Testimonial (Admin)
 * @route GET /admin/book-demo/testimonial
 * @access Admin (Protected)
 */
async function getTestimonialAdmin(req, res) {
  try {
    const testimonial = await BookDemoTestimonial.findOne().sort({ createdAt: -1 });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial fetched successfully",
      data: sanitizeTestimonial(testimonial),
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update Testimonial
 * @route PUT /admin/book-demo/testimonial/:id
 * @access Admin (Protected)
 */
async function updateTestimonial(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Testimonial ID",
      });
    }

    const existingRecord = await BookDemoTestimonial.findById(id);

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const updatePayload = {};

    // Update fields if provided
    const textFields = ["quote", "authorName", "authorRole", "authorCompany"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    const updatedRecord = await BookDemoTestimonial.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: sanitizeTestimonial(updatedRecord),
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete Testimonial
 * @route DELETE /admin/book-demo/testimonial/:id
 * @access Admin (Protected)
 */
async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Testimonial ID",
      });
    }

    const record = await BookDemoTestimonial.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Public Testimonial
 * @route GET /book-demo/testimonial
 * @access Public (No Authentication)
 */
async function getPublicTestimonial(req, res) {
  try {
    const testimonial = await BookDemoTestimonial.findOne().sort({ updatedAt: -1, createdAt: -1 });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeTestimonial(testimonial),
    });
  } catch (error) {
    console.error("Error fetching public testimonial:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createTestimonial,
  getTestimonialAdmin,
  updateTestimonial,
  deleteTestimonial,
  getPublicTestimonial,
};
