const { isValidObjectId } = require("mongoose");
const CaseModulesSection = require("../../model/Homepage/CaseModulesSection");

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
    return { status: 400, message: "Invalid core modules section data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates incoming section payload.
 * @param {object}  payload    - req.body
 * @param {boolean} requireAll - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = ["badgeText", "title", "description"];

  if (requireAll) {
    for (const field of requiredTextFields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        return `${field} is required and must not be empty`;
      }
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

  // highlightedTitle is optional — validate type only when provided
  if (
    payload.highlightedTitle !== undefined &&
    typeof payload.highlightedTitle !== "string"
  ) {
    return "highlightedTitle must be a string";
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
 * GET /core-modules
 * Returns the active Core Modules section (public).
 */
async function getCoreModulesSection(req, res) {
  try {
    const section = await CaseModulesSection.findOne({ isActive: true }).sort({
      createdAt: 1,
    });

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "No active core modules section found" });
    }

    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error("Get Core Modules Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/core-modules
 * Returns all sections regardless of isActive status.
 */
async function adminGetCoreModulesSection(req, res) {
  try {
    const sections = await CaseModulesSection.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "Core modules section fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Admin Get Core Modules Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/core-modules
 * Creates a new Core Modules section.
 */
async function createCoreModulesSection(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const section = await CaseModulesSection.create({
      badgeText: req.body.badgeText.trim(),
      title: req.body.title.trim(),
      ...(req.body.highlightedTitle !== undefined && {
        highlightedTitle: req.body.highlightedTitle.trim(),
      }),
      description: req.body.description.trim(),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Core modules section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create Core Modules Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/core-modules/:id
 * Updates an existing Core Modules section.
 */
async function updateCoreModulesSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid core modules section id" });
    }

    const validationError = validatePayload(req.body, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    const textFields = ["badgeText", "title", "highlightedTitle", "description"];
    for (const field of textFields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field].trim();
      }
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    const section = await CaseModulesSection.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Core modules section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Core modules section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update Core Modules Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/core-modules/:id
 * Deletes a Core Modules section.
 */
async function deleteCoreModulesSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid core modules section id" });
    }

    const section = await CaseModulesSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Core modules section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Core modules section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.error("Delete Core Modules Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getCoreModulesSection,
  adminGetCoreModulesSection,
  createCoreModulesSection,
  updateCoreModulesSection,
  deleteCoreModulesSection,
};
