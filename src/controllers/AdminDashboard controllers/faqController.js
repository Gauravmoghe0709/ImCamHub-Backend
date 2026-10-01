const { isValidObjectId } = require("mongoose");
const AdminDashboardFaq = require("../../model/AdminDashboardmodel/faq");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid FAQ data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin-dashboard/faq        (public)
 * GET /admin/dashboard/faq        (admin)
 * Returns all FAQ records.
 */
async function getFaqs(req, res) {
  try {
    const faqs = await AdminDashboardFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/dashboard/faq/:id
 * Returns a single FAQ by ID.
 */
async function getFaqById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    const faq = await AdminDashboardFaq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ fetched successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Get FAQ By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/dashboard/faq
 * Creates a new FAQ.
 */
async function createFaq(req, res) {
  try {
    const requiredFields = ["question", "answer"];
    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        !String(req.body[field]).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const faq = await AdminDashboardFaq.create({
      question: normalizeText(req.body.question),
      answer: normalizeText(req.body.answer),
    });

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Create FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/dashboard/faq/:id
 * Updates an existing FAQ by ID.
 */
async function updateFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    const existing = await AdminDashboardFaq.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    const updatePayload = {};
    if (req.body.question !== undefined) {
      updatePayload.question = normalizeText(req.body.question);
    }
    if (req.body.answer !== undefined) {
      updatePayload.answer = normalizeText(req.body.answer);
    }

    const updated = await AdminDashboardFaq.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/dashboard/faq/:id
 * Deletes a FAQ by ID.
 */
async function deleteFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ id",
      });
    }

    const faq = await AdminDashboardFaq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
