const { isValidObjectId } = require("mongoose");
const ClientPortalFaq = require("../../model/ClientPortalmodel/ClientPortalFaq.model");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid ClientPortal Portal FAQ data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /ClientPortal-portal/faqs
 * Returns all ClientPortal Portal FAQ items (public, no auth).
 * No maximum limit — supports unlimited FAQs.
 */
async function getPublicClientPortalFaqs(req, res) {
  try {
    const faqs = await ClientPortalFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get Public ClientPortal Portal FAQs Error:", error);
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
 * GET /admin/ClientPortal-portal/faqs
 * Returns all ClientPortal Portal FAQ items (admin).
 * No maximum limit — supports unlimited FAQs.
 */
async function getAllClientPortalFaqs(req, res) {
  try {
    const faqs = await ClientPortalFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get All ClientPortal Portal FAQs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/ClientPortal-portal/faqs/:id
 * Returns a single ClientPortal Portal FAQ by ID (admin).
 */
async function getClientPortalFaqById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal FAQ id",
      });
    }

    const faq = await ClientPortalFaq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Get ClientPortal Portal FAQ By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/ClientPortal-portal/faqs
 * Creates a new ClientPortal Portal FAQ record.
 * Admin can create unlimited FAQs — NO maximum limit.
 */
async function createClientPortalFaq(req, res) {
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

    const faq = await ClientPortalFaq.create({
      question: normalizeText(question),
      answer: normalizeText(answer),
    });

    return res.status(201).json({
      success: true,
      message: "ClientPortal Portal FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Create ClientPortal Portal FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/ClientPortal-portal/faqs/:id
 * Updates an existing ClientPortal Portal FAQ by ID.
 */
async function updateClientPortalFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal FAQ id",
      });
    }

    const existing = await ClientPortalFaq.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal FAQ not found",
      });
    }

    const updatePayload = {};
    if (req.body.question !== undefined) {
      updatePayload.question = normalizeText(req.body.question);
    }
    if (req.body.answer !== undefined) {
      updatePayload.answer = normalizeText(req.body.answer);
    }

    const updated = await ClientPortalFaq.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal FAQ updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update ClientPortal Portal FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/ClientPortal-portal/faqs/:id
 * Deletes a ClientPortal Portal FAQ by ID.
 * Does NOT affect Header — completely independent.
 * Does NOT affect other FAQs — deletes only the specified FAQ.
 */
async function deleteClientPortalFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal FAQ id",
      });
    }

    const faq = await ClientPortalFaq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal FAQ deleted successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Delete ClientPortal Portal FAQ Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicClientPortalFaqs,
  getAllClientPortalFaqs,
  getClientPortalFaqById,
  createClientPortalFaq,
  updateClientPortalFaq,
  deleteClientPortalFaq,
};
