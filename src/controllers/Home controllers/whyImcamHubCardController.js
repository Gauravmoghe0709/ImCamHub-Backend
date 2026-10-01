const { isValidObjectId } = require("mongoose");
const WhyImcamHubCard = require("../../model/Homepage/whyImcamHubCard");

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
    return { status: 400, message: "Invalid why ImCam Hub card data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates the incoming card payload.
 * @param {object}  payload    - req.body
 * @param {boolean} requireAll - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = ["title", "description"];

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
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /why-imcam-hub/cards
 * Returns only active cards sorted by displayOrder ASC (public).
 */
async function getActiveWhyImcamHubCards(req, res) {
  try {
    const cards = await WhyImcamHubCard.find({ isActive: true }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error("Get Active Why ImCam Hub Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/why-imcam-hub/cards
 * Returns all cards (active + inactive) sorted by displayOrder ASC.
 */
async function adminGetAllWhyImcamHubCards(req, res) {
  try {
    const cards = await WhyImcamHubCard.find().sort({ displayOrder: 1 });
    return res.status(200).json({
      success: true,
      message: "Why ImCam Hub cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Admin Get All Why ImCam Hub Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * GET /admin/why-imcam-hub/cards/:id
 * Returns a single card by ID.
 */
async function adminGetWhyImcamHubCardById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid why ImCam Hub card id" });
    }

    const card = await WhyImcamHubCard.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Why ImCam Hub card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Why ImCam Hub card fetched successfully",
      data: card,
    });
  } catch (error) {
    console.error("Admin Get Why ImCam Hub Card By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/why-imcam-hub/cards
 * Creates a new Why ImCam Hub card.
 */
async function createWhyImcamHubCard(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const card = await WhyImcamHubCard.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      displayOrder: req.body.displayOrder,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Why ImCam Hub card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Why ImCam Hub Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/why-imcam-hub/cards/:id
 * Updates an existing Why ImCam Hub card.
 */
async function updateWhyImcamHubCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid why ImCam Hub card id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) updatePayload.title = req.body.title.trim();
    if (req.body.description !== undefined)
      updatePayload.description = req.body.description.trim();
    if (req.body.displayOrder !== undefined)
      updatePayload.displayOrder = req.body.displayOrder;
    if (req.body.isActive !== undefined)
      updatePayload.isActive = parseBoolean(req.body.isActive);

    const card = await WhyImcamHubCard.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Why ImCam Hub card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Why ImCam Hub card updated successfully",
      data: card,
    });
  } catch (error) {
    console.error("Update Why ImCam Hub Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/why-imcam-hub/cards/:id
 * Deletes a Why ImCam Hub card by ID.
 */
async function deleteWhyImcamHubCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid why ImCam Hub card id" });
    }

    const card = await WhyImcamHubCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Why ImCam Hub card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Why ImCam Hub card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Why ImCam Hub Card Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getActiveWhyImcamHubCards,
  adminGetAllWhyImcamHubCards,
  adminGetWhyImcamHubCardById,
  createWhyImcamHubCard,
  updateWhyImcamHubCard,
  deleteWhyImcamHubCard,
};
