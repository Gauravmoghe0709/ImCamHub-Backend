const { isValidObjectId } = require("mongoose");
const FaqSection = require("../../model/Homepage/faqSection");
const Faq = require("../../model/Homepage/faq");
const FaqCta = require("../../model/Homepage/faqCta");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid FAQ section data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates the incoming FAQ section payload.
 * @param {object}  payload    - req.body
 * @param {boolean} requireAll - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = ["badgeText", "title", "highlightedText"];

  if (requireAll) {
    for (const field of requiredTextFields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        return `${field} is required and must not be empty`;
      }
    }
  } else {
    for (const field of requiredTextFields) {
      if (
        payload[field] !== undefined &&
        (typeof payload[field] !== "string" || !payload[field].trim())
      ) {
        return `${field} must be a non-empty string`;
      }
    }
  }

  return null;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /faq
 * Returns the FAQ section, active FAQs sorted by displayOrder ASC, and CTA.
 */
async function getPublicFaq(req, res) {
  try {
    const [section, faqs, cta] = await Promise.all([
      FaqSection.findOne().sort({ createdAt: 1 }),
      Faq.find({ isActive: true }).sort({ displayOrder: 1 }),
      FaqCta.findOne().sort({ createdAt: 1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        section: section || null,
        faqs,
        cta: cta || null,
      },
    });
  } catch (error) {
    console.error("Get Public FAQ Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/faq
 * Returns the FAQ section configuration (admin).
 */
async function adminGetFaqSection(req, res) {
  try {
    const sections = await FaqSection.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "FAQ section fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Admin Get FAQ Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/faq
 * Creates the FAQ section — only one record allowed (singleton).
 */
async function createFaqSection(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Singleton guard
    const existing = await FaqSection.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "FAQ section already exists. Use PUT /admin/faq/:id to update it.",
      });
    }

    const section = await FaqSection.create({
      badgeText: req.body.badgeText.trim(),
      title: req.body.title.trim(),
      highlightedText: req.body.highlightedText.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "FAQ section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create FAQ Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/faq/:id
 * Updates the FAQ section.
 */
async function updateFaqSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ section id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    const fields = ["badgeText", "title", "highlightedText"];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field].trim();
      }
    }

    const section = await FaqSection.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ success: false, message: "FAQ section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update FAQ Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/faq/:id
 * Deletes the FAQ section.
 */
async function deleteFaqSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ section id" });
    }

    const section = await FaqSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "FAQ section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.error("Delete FAQ Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getPublicFaq,
  adminGetFaqSection,
  createFaqSection,
  updateFaqSection,
  deleteFaqSection,
};
