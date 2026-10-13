const { isValidObjectId } = require("mongoose");
const CaseModuleCard = require("../../model/Homepage/CaseModuleCard");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_MODULE_CARDS = 4;

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
    return { status: 400, message: "Invalid module card data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates the incoming module card payload.
 * @param {object}  payload    - req.body
 * @param {boolean} requireAll - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = ["title", "description", "linkText", "linkUrl"];

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

  if (payload.displayOrder !== undefined && !Number.isInteger(payload.displayOrder)) {
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
 * GET /core-modules/cards
 * Returns only active cards sorted by displayOrder ASC (public).
 */
async function getActiveCoreModuleCards(req, res) {
  try {
    const cards = await CaseModuleCard.find({ isActive: true }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({ success: true, data: cards });
  } catch (error) {
    console.error("Get Active Core Module Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/core-modules/cards
 * Returns all cards (active + inactive) sorted by displayOrder ASC.
 */
async function adminGetAllCoreModuleCards(req, res) {
  try {
    const cards = await CaseModuleCard.find().sort({ displayOrder: 1 });
    return res.status(200).json({
      success: true,
      message: "Core module cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Admin Get All Core Module Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * GET /admin/core-modules/cards/:id
 * Returns a single module card by ID.
 */
async function adminGetCoreModuleCardById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid module card id" });
    }

    const card = await CaseModuleCard.findById(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Module card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Module card fetched successfully",
      data: card,
    });
  } catch (error) {
    console.error("Admin Get Core Module Card By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/core-modules/cards
 * Creates a new module card — enforces a strict maximum of 4.
 */
async function createCoreModuleCard(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Enforce the 4-card limit before creation
    const totalCards = await CaseModuleCard.countDocuments();
    if (totalCards >= MAX_MODULE_CARDS) {
      return res.status(409).json({
        success: false,
        message: "Maximum 4 module cards are allowed.",
      });
    }

    const card = await CaseModuleCard.create({
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      linkText: req.body.linkText.trim(),
      linkUrl: req.body.linkUrl.trim(),
      displayOrder: req.body.displayOrder,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Module card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Core Module Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/core-modules/cards/:id
 * Updates an existing module card — the 4-card limit does NOT apply to updates.
 */
async function updateCoreModuleCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid module card id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    const textFields = ["title", "description", "linkText", "linkUrl"];
    for (const field of textFields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field].trim();
      }
    }
    if (req.body.displayOrder !== undefined)
      updatePayload.displayOrder = req.body.displayOrder;
    if (req.body.isActive !== undefined)
      updatePayload.isActive = parseBoolean(req.body.isActive);

    const card = await CaseModuleCard.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Module card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Module card updated successfully",
      data: card,
    });
  } catch (error) {
    console.error("Update Core Module Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/core-modules/cards/:id
 * Deletes a module card by ID.
 */
async function deleteCoreModuleCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid module card id" });
    }

    const card = await CaseModuleCard.findByIdAndDelete(req.params.id);
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Module card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Module card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Core Module Card Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getActiveCoreModuleCards,
  adminGetAllCoreModuleCards,
  adminGetCoreModuleCardById,
  createCoreModuleCard,
  updateCoreModuleCard,
  deleteCoreModuleCard,
};
