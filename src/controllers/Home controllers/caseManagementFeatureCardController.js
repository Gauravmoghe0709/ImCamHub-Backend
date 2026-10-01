const { isValidObjectId } = require("mongoose");
const CaseManagementFeatureCard = require("../../model/Homepage/caseManagementFeatureCard");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_CASE_MANAGEMENT_CARDS = 6;

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
    return { status: 400, message: "Invalid case management feature card data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates the incoming feature card payload.
 * @param {object}  payload      - req.body
 * @param {boolean} requireAll   - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  // title
  if (requireAll) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      return "title is required and must not be empty";
    }
  } else if (payload.title !== undefined) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      return "title must be a non-empty string";
    }
  }

  // description
  if (requireAll) {
    if (typeof payload.description !== "string" || !payload.description.trim()) {
      return "description is required and must not be empty";
    }
  } else if (payload.description !== undefined) {
    if (typeof payload.description !== "string" || !payload.description.trim()) {
      return "description must be a non-empty string";
    }
  }

  // tags — optional, but must be an array of strings when provided
  if (payload.tags !== undefined) {
    if (!Array.isArray(payload.tags)) {
      return "tags must be an array";
    }
    const invalidTag = payload.tags.find((t) => typeof t !== "string");
    if (invalidTag !== undefined) {
      return "Every value in tags must be a string";
    }
  }

  // displayOrder
  if (requireAll) {
    if (payload.displayOrder === undefined) {
      return "displayOrder is required";
    }
  }
  if (payload.displayOrder !== undefined) {
    if (!Number.isInteger(payload.displayOrder)) {
      return "displayOrder must be an integer";
    }
  }

  // isActive
  if (requireAll && payload.isActive === undefined) {
    return "isActive is required";
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
 * GET /case-management/cards
 * Returns only active cards sorted by displayOrder ASC (public).
 */
async function getActiveCaseManagementCards(req, res) {
  try {
    const cards = await CaseManagementFeatureCard.find({ isActive: true }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error("Get Active Case Management Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/case-management/cards
 * Returns all cards (active + inactive) sorted by displayOrder ASC.
 */
async function adminGetAllCaseManagementCards(req, res) {
  try {
    const cards = await CaseManagementFeatureCard.find().sort({ displayOrder: 1 });
    return res.status(200).json({
      success: true,
      message: "Case management feature cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Admin Get All Case Management Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * GET /admin/case-management/cards/:id
 * Returns a single card by ID.
 */
async function adminGetCaseManagementCardById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid case management feature card id" });
    }

    const card = await CaseManagementFeatureCard.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Case management feature card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Case management feature card fetched successfully",
      data: card,
    });
  } catch (error) {
    console.error("Admin Get Case Management Card By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/case-management/cards
 * Creates a new card — enforces a strict maximum of 6.
 */
async function createCaseManagementCard(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Enforce the 6-card limit before creation
    const totalCards = await CaseManagementFeatureCard.countDocuments();
    if (totalCards >= MAX_CASE_MANAGEMENT_CARDS) {
      return res.status(409).json({
        success: false,
        message: "Maximum 6 feature cards are allowed.",
      });
    }

    const card = await CaseManagementFeatureCard.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      displayOrder: req.body.displayOrder,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Case management feature card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Case Management Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/case-management/cards/:id
 * Updates an existing card — the 6-card limit does NOT apply to updates.
 */
async function updateCaseManagementCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid case management feature card id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) updatePayload.title = req.body.title.trim();
    if (req.body.description !== undefined)
      updatePayload.description = req.body.description.trim();
    if (req.body.tags !== undefined) updatePayload.tags = req.body.tags;
    if (req.body.displayOrder !== undefined)
      updatePayload.displayOrder = req.body.displayOrder;
    if (req.body.isActive !== undefined)
      updatePayload.isActive = parseBoolean(req.body.isActive);

    const card = await CaseManagementFeatureCard.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Case management feature card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Case management feature card updated successfully",
      data: card,
    });
  } catch (error) {
    console.error("Update Case Management Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/case-management/cards/:id
 * Deletes a card by ID.
 */
async function deleteCaseManagementCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid case management feature card id" });
    }

    const card = await CaseManagementFeatureCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Case management feature card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Case management feature card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Case Management Card Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getActiveCaseManagementCards,
  adminGetAllCaseManagementCards,
  adminGetCaseManagementCardById,
  createCaseManagementCard,
  updateCaseManagementCard,
  deleteCaseManagementCard,
};
