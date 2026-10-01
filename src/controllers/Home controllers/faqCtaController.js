const { isValidObjectId } = require("mongoose");
const FaqCta = require("../../model/Homepage/faqCta");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Simple email format validator — consistent with the project's inline pattern
const isValidEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid FAQ CTA data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates the incoming CTA payload.
 * @param {object}  payload    - req.body
 * @param {boolean} requireAll - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = [
    "title",
    "description",
    "phone",
    "ctaText",
    "ctaLink",
  ];

  if (requireAll) {
    for (const field of requiredTextFields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        return `${field} is required and must not be empty`;
      }
    }
    if (!payload.email || !isValidEmail(payload.email)) {
      return "email is required and must be a valid email address";
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
    if (payload.email !== undefined && !isValidEmail(payload.email)) {
      return "email must be a valid email address";
    }
  }

  return null;
};

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/faq/cta
 * Returns the CTA configuration.
 */
async function adminGetFaqCta(req, res) {
  try {
    const ctas = await FaqCta.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "FAQ CTA fetched successfully",
      data: ctas,
    });
  } catch (error) {
    console.error("Admin Get FAQ CTA Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/faq/cta
 * Creates the FAQ CTA card — only one record allowed (singleton).
 */
async function createFaqCta(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Singleton guard
    const existing = await FaqCta.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "FAQ CTA already exists. Use PUT /admin/faq/cta/:id to update it.",
      });
    }

    const cta = await FaqCta.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      email: req.body.email.trim().toLowerCase(),
      phone: req.body.phone.trim(),
      ctaText: req.body.ctaText.trim(),
      ctaLink: req.body.ctaLink.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "FAQ CTA created successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Create FAQ CTA Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/faq/cta/:id
 * Updates the FAQ CTA card.
 */
async function updateFaqCta(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ CTA id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    const textFields = ["title", "description", "phone", "ctaText", "ctaLink"];
    for (const field of textFields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field].trim();
      }
    }
    if (req.body.email !== undefined) {
      updatePayload.email = req.body.email.trim().toLowerCase();
    }

    const cta = await FaqCta.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!cta) {
      return res.status(404).json({ success: false, message: "FAQ CTA not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ CTA updated successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Update FAQ CTA Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/faq/cta/:id
 * Deletes the FAQ CTA card.
 */
async function deleteFaqCta(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ CTA id" });
    }

    const cta = await FaqCta.findByIdAndDelete(req.params.id);
    if (!cta) {
      return res.status(404).json({ success: false, message: "FAQ CTA not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ CTA deleted successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Delete FAQ CTA Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  adminGetFaqCta,
  createFaqCta,
  updateFaqCta,
  deleteFaqCta,
};
