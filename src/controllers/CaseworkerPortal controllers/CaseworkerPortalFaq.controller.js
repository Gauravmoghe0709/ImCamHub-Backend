const { isValidObjectId } = require("mongoose");
const CaseworkerPortalFaq = require("../../model/CaseworkerPortalmodel/CaseworkerPortalFaq.model");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid Caseworker Portal FAQ data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal/faqs
 * Returns all Caseworker Portal FAQ items (public, no auth).
 * No maximum limit — supports unlimited FAQs.
 */
async function getPublicCaseworkerPortalFaqs(req, res) {
  try {
    const faqs = await CaseworkerPortalFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get Public Caseworker Portal FAQs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/caseworker-portal/faqs
 * Returns all Caseworker Portal FAQ items (admin).
 * No maximum limit — supports unlimited FAQs.
 */
async function getAllCaseworkerPortalFaqs(req, res) {
  try {
    const faqs = await CaseworkerPortalFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get All Caseworker Portal FAQs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/caseworker-portal/faqs/:id
 * Returns a single Caseworker Portal FAQ by ID (admin).
 */
async function getCaseworkerPortalFaqById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal FAQ id",
      });
    }

    const faq = await CaseworkerPortalFaq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Get Caseworker Portal FAQ By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/caseworker-portal/faqs
 * Creates a new Caseworker Portal FAQ record.
 * Admin can create unlimited FAQs — NO maximum limit.
 */
async function createCaseworkerPortalFaq(req, res) {
  try {
    // Validate required fields
    const { question, answer } = req.body;

    if (
      question === undefined ||
      question === null ||
      !String(question).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "question is required",
      });
    }

    if (answer === undefined || answer === null || !String(answer).trim()) {
      return res.status(400).json({
        success: false,
        message: "answer is required",
      });
    }

    const faq = await CaseworkerPortalFaq.create({
      question: normalizeText(question),
      answer: normalizeText(answer),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Portal FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Create Caseworker Portal FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/caseworker-portal/faqs/:id
 * Updates an existing Caseworker Portal FAQ by ID.
 */
async function updateCaseworkerPortalFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal FAQ id",
      });
    }

    const existing = await CaseworkerPortalFaq.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal FAQ not found",
      });
    }

    const updatePayload = {};
    if (req.body.question !== undefined) {
      updatePayload.question = normalizeText(req.body.question);
    }
    if (req.body.answer !== undefined) {
      updatePayload.answer = normalizeText(req.body.answer);
    }

    const updated = await CaseworkerPortalFaq.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal FAQ updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Portal FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/caseworker-portal/faqs/:id
 * Deletes a Caseworker Portal FAQ by ID.
 * Does NOT affect Header — completely independent.
 * Does NOT affect other FAQs — deletes only the specified FAQ.
 */
async function deleteCaseworkerPortalFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal FAQ id",
      });
    }

    const faq = await CaseworkerPortalFaq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal FAQ deleted successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Delete Caseworker Portal FAQ Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicCaseworkerPortalFaqs,
  getAllCaseworkerPortalFaqs,
  getCaseworkerPortalFaqById,
  createCaseworkerPortalFaq,
  updateCaseworkerPortalFaq,
  deleteCaseworkerPortalFaq,
};
