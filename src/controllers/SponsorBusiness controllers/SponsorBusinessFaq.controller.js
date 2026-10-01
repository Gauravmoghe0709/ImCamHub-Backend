const { isValidObjectId } = require("mongoose");
const SponsorBusinessFaq = require("../../model/SponsorBusinessmodel/SponsorBusinessFaq.model");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid SponsorBusiness Portal FAQ data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /SponsorBusiness-portal/faqs
 * Returns all SponsorBusiness Portal FAQ items (public, no auth).
 * No maximum limit — supports unlimited FAQs.
 */
async function getPublicSponsorBusinessFaqs(req, res) {
  try {
    const faqs = await SponsorBusinessFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get Public SponsorBusiness Portal FAQs Error:", error);
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
 * GET /admin/SponsorBusiness-portal/faqs
 * Returns all SponsorBusiness Portal FAQ items (admin).
 * No maximum limit — supports unlimited FAQs.
 */
async function getAllSponsorBusinessFaqs(req, res) {
  try {
    const faqs = await SponsorBusinessFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Get All SponsorBusiness Portal FAQs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/SponsorBusiness-portal/faqs/:id
 * Returns a single SponsorBusiness Portal FAQ by ID (admin).
 */
async function getSponsorBusinessFaqById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal FAQ id",
      });
    }

    const faq = await SponsorBusinessFaq.findById(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Get SponsorBusiness Portal FAQ By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/SponsorBusiness-portal/faqs
 * Creates a new SponsorBusiness Portal FAQ record.
 * Admin can create unlimited FAQs — NO maximum limit.
 */
async function createSponsorBusinessFaq(req, res) {
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

    const faq = await SponsorBusinessFaq.create({
      question: normalizeText(question),
      answer: normalizeText(answer),
    });

    return res.status(201).json({
      success: true,
      message: "SponsorBusiness Portal FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Create SponsorBusiness Portal FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/SponsorBusiness-portal/faqs/:id
 * Updates an existing SponsorBusiness Portal FAQ by ID.
 */
async function updateSponsorBusinessFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal FAQ id",
      });
    }

    const existing = await SponsorBusinessFaq.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal FAQ not found",
      });
    }

    const updatePayload = {};
    if (req.body.question !== undefined) {
      updatePayload.question = normalizeText(req.body.question);
    }
    if (req.body.answer !== undefined) {
      updatePayload.answer = normalizeText(req.body.answer);
    }

    const updated = await SponsorBusinessFaq.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal FAQ updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update SponsorBusiness Portal FAQ Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/SponsorBusiness-portal/faqs/:id
 * Deletes a SponsorBusiness Portal FAQ by ID.
 * Does NOT affect Header — completely independent.
 * Does NOT affect other FAQs — deletes only the specified FAQ.
 */
async function deleteSponsorBusinessFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal FAQ id",
      });
    }

    const faq = await SponsorBusinessFaq.findByIdAndDelete(id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal FAQ deleted successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Delete SponsorBusiness Portal FAQ Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicSponsorBusinessFaqs,
  getAllSponsorBusinessFaqs,
  getSponsorBusinessFaqById,
  createSponsorBusinessFaq,
  updateSponsorBusinessFaq,
  deleteSponsorBusinessFaq,
};
