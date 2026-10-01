const { isValidObjectId } = require("mongoose");
const Faq = require("../../model/Homepage/faq");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return undefined;
};

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid FAQ data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates the incoming FAQ payload.
 * @param {object}  payload    - req.body
 * @param {boolean} requireAll - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = ["question", "answer"];

  if (requireAll) {
    for (const field of requiredTextFields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        return `${field} is required and must not be empty`;
      }
    }
    if (payload.displayOrder === undefined) {
      return "displayOrder is required";
    }
    if (payload.isActive === undefined) {
      return "isActive is required";
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

  if (
    payload.displayOrder !== undefined &&
    !Number.isInteger(payload.displayOrder)
  ) {
    return "displayOrder must be an integer";
  }

  if (
    payload.isActive !== undefined &&
    parseBoolean(payload.isActive) === undefined
  ) {
    return "isActive must be a boolean";
  }

  return null;
};

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/faq/items
 * Returns all FAQs (active + inactive) sorted by displayOrder ASC.
 */
async function adminGetAllFaqs(req, res) {
  try {
    const faqs = await Faq.find().sort({ displayOrder: 1 });
    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      data: faqs,
    });
  } catch (error) {
    console.error("Admin Get All FAQs Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * GET /admin/faq/items/:id
 * Returns a single FAQ by ID.
 */
async function adminGetFaqById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ id" });
    }

    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ fetched successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Admin Get FAQ By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/faq/items
 * Creates a new FAQ.
 */
async function createFaq(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const faq = await Faq.create({
      question: req.body.question.trim(),
      answer: req.body.answer,
      displayOrder: req.body.displayOrder,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Create FAQ Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/faq/items/:id
 * Updates an existing FAQ.
 */
async function updateFaq(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    if (req.body.question !== undefined)
      updatePayload.question = req.body.question.trim();
    // answer preserved as-is to support rich text
    if (req.body.answer !== undefined) updatePayload.answer = req.body.answer;
    if (req.body.displayOrder !== undefined)
      updatePayload.displayOrder = req.body.displayOrder;
    if (req.body.isActive !== undefined)
      updatePayload.isActive = parseBoolean(req.body.isActive);

    const faq = await Faq.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Update FAQ Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/faq/items/:id
 * Deletes a FAQ by ID.
 */
async function deleteFaq(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ id" });
    }

    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
      data: faq,
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  adminGetAllFaqs,
  adminGetFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
