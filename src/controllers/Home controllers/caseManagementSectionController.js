const { isValidObjectId } = require("mongoose");
const CaseManagementSection = require("../../model/Homepage/CaseManagementSection");

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
    return { status: 400, message: "Invalid case management section data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates incoming section payload.
 * @param {object} payload        - req.body
 * @param {boolean} requireAll    - true on create, false on update
 */
const validatePayload = (payload, requireAll = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const requiredTextFields = ["badgeText", "title", "description"];

  if (requireAll) {
    // All required text fields must be present and non-empty
    for (const field of requiredTextFields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        return `${field} is required and must not be empty`;
      }
    }
    // isActive is required on create
    if (payload.isActive === undefined) {
      return "isActive is required";
    }
  } else {
    // On update, only validate fields that are actually provided
    for (const field of requiredTextFields) {
      if (
        payload[field] !== undefined &&
        (typeof payload[field] !== "string" || !payload[field].trim())
      ) {
        return `${field} must be a non-empty string`;
      }
    }
  }

  // highlightedTitle is always optional — validate type only when provided
  if (
    payload.highlightedTitle !== undefined &&
    typeof payload.highlightedTitle !== "string"
  ) {
    return "highlightedTitle must be a string";
  }

  // isActive type check
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

async function getCaseManagementSection(req, res) {
  try {
    const section = await CaseManagementSection.findOne({ isActive: true }).sort({
      createdAt: 1,
    });

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "No active case management section found" });
    }

    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error("Get Case Management Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------
async function adminGetCaseManagementSection(req, res) {
  try {
    const sections = await CaseManagementSection.find().sort({ createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "Case management section fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Admin Get Case Management Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/case-management
 * Creates a new case management section.
 */
async function createCaseManagementSection(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const section = await CaseManagementSection.create({
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
      message: "Case management section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create Case Management Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/case-management/:id
 * Updates an existing case management section.
 */
async function updateCaseManagementSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid case management section id" });
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

    const section = await CaseManagementSection.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Case management section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Case management section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update Case Management Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/case-management/:id
 * Deletes a case management section.
 */
async function deleteCaseManagementSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid case management section id" });
    }

    const section = await CaseManagementSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Case management section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Case management section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.error("Delete Case Management Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getCaseManagementSection,
  adminGetCaseManagementSection,
  createCaseManagementSection,
  updateCaseManagementSection,
  deleteCaseManagementSection,
};
