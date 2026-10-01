const { isValidObjectId } = require("mongoose");
const OurSolutionsHeader = require("../../model/SolutionsPage model/OurSolutionsHeader");

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
 * Returns the active Our Solutions Header (public, no auth required).
 */
async function getOurSolutionsHeader(req, res) {
  try {
    const header = await OurSolutionsHeader.findOne({ is_active: true });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No active Our Solutions Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Our Solutions Header Error:", error);
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
 * POST /admin/solutions/header
 * Creates a new Our Solutions Header record.
 */
async function createOurSolutionsHeader(req, res) {
  try {
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

    const header = await OurSolutionsHeader.create({
      title: normalizeText(title),
      ...(req.body.highlighted_text !== undefined && {
        highlighted_text: normalizeText(req.body.highlighted_text),
      }),
      description: normalizeText(description),
      is_active: is_active !== undefined ? parseBoolean(is_active) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Our Solutions Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create Our Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions/header
 * Returns all Our Solutions Header records (active + inactive).
 */
async function getAllOurSolutionsHeaders(req, res) {
  try {
    const headers = await OurSolutionsHeader.find().sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      data: headers,
    });
  } catch (error) {
    console.error("Get All Our Solutions Headers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions/header/:id
 * Returns a single Our Solutions Header by ID.
 */
async function getOurSolutionsHeaderById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Header id",
      });
    }

    const header = await OurSolutionsHeader.findById(id);

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Our Solutions Header By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/solutions/header/:id
 * Updates an existing Our Solutions Header by ID.
 */
async function updateOurSolutionsHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Header id",
      });
    }

    const existing = await OurSolutionsHeader.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Header not found",
      });
    }

    const updatePayload = {};

    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }

    if (req.body.highlighted_text !== undefined) {
      updatePayload.highlighted_text = normalizeText(req.body.highlighted_text);
    }

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }

    if (req.body.is_active !== undefined) {
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    const updated = await OurSolutionsHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Our Solutions Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Our Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/solutions/header/:id
 * Deletes an Our Solutions Header by ID.
 */
async function deleteOurSolutionsHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Header id",
      });
    }

    const header = await OurSolutionsHeader.findByIdAndDelete(id);

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Our Solutions Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete Our Solutions Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/solutions/header/:id/status
 * Toggles the active/inactive status of an Our Solutions Header.
 */
async function toggleOurSolutionsHeaderStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Header id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const header = await OurSolutionsHeader.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Our Solutions Header status updated successfully",
      data: header,
    });
  } catch (error) {
    console.error("Toggle Our Solutions Header Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getOurSolutionsHeader,
  createOurSolutionsHeader,
  getAllOurSolutionsHeaders,
  getOurSolutionsHeaderById,
  updateOurSolutionsHeader,
  deleteOurSolutionsHeader,
  toggleOurSolutionsHeaderStatus,
};
