const { isValidObjectId } = require("mongoose");
const SolutionsHeaderContent = require("../../model/SolutionsPage model/SolutionsHeaderContent");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return value;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /solutions/header
 * Returns the active Solutions Header section (public, no auth required).
 */
async function getPublicSolutionsHeader(req, res) {
  try {
    const header = await SolutionsHeaderContent.findOne({
      is_active: true,
    });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No active Solutions Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Public Solutions Header Error:", error);
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
 * GET /admin/solutions/header
 * Returns the Solutions Header section for admin (active + inactive).
 */
async function getAdminSolutionsHeader(req, res) {
  try {
    const header = await SolutionsHeaderContent.findOne();

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Solutions Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Admin Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/solutions/header
 * Creates a new Solutions Header record.
 * Singleton pattern: only one header record should exist.
 */
async function createSolutionsHeader(req, res) {
  try {
    // Check for existing header to enforce singleton pattern
    const existingHeader = await SolutionsHeaderContent.findOne();
    if (existingHeader) {
      return res.status(409).json({
        success: false,
        message: "Solutions Header already exists. Use PUT to update it.",
      });
    }

    // Validate required fields
    const { title, description, is_active } = req.body;

    if (title === undefined || title === null || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    if (
      description === undefined ||
      description === null ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }

    const header = await SolutionsHeaderContent.create({
      title: normalizeText(title),
      description: normalizeText(description),
      is_active: is_active !== undefined ? parseBoolean(is_active) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Solutions Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/solutions/header/:id
 * Updates an existing Solutions Header by ID.
 */
async function updateSolutionsHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Header id",
      });
    }

    const existing = await SolutionsHeaderContent.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Solutions Header not found",
      });
    }

    const updatePayload = {};

    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }

    if (req.body.is_active !== undefined) {
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    const updated = await SolutionsHeaderContent.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Solutions Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/solutions/header/:id
 * Deletes the Solutions Header by ID.
 */
async function deleteSolutionsHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Header id",
      });
    }

    const header = await SolutionsHeaderContent.findByIdAndDelete(id);

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Solutions Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/solutions/header/:id/status
 * Toggles the active/inactive status of the Solutions Header.
 */
async function toggleSolutionsHeaderStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Header id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const header = await SolutionsHeaderContent.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Solutions Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Header status updated successfully",
      data: header,
    });
  } catch (error) {
    console.error("Toggle Solutions Header Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicSolutionsHeader,
  getAdminSolutionsHeader,
  createSolutionsHeader,
  updateSolutionsHeader,
  deleteSolutionsHeader,
  toggleSolutionsHeaderStatus,
};
