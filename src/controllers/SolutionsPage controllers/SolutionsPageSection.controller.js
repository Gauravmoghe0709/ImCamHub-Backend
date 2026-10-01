const { isValidObjectId } = require("mongoose");
const SolutionsPageSection = require("../../model/SolutionsPage model/SolutionsPageSection");
const uploadImage = require("../../services/Storage.services");

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

const parseNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  }
  return value;
};

/**
 * Parses stats JSON string (from multipart/form-data) into an array.
 * Validates each stat object and normalizes field values.
 */
const parseAndValidateStats = (statsInput) => {
  let stats;

  // Handle string JSON (from multipart/form-data)
  if (typeof statsInput === "string") {
    try {
      stats = JSON.parse(statsInput);
    } catch (e) {
      throw new Error("stats must be a valid JSON array");
    }
  } else if (Array.isArray(statsInput)) {
    stats = statsInput;
  } else {
    throw new Error("stats must be an array");
  }

  if (!Array.isArray(stats) || stats.length === 0) {
    throw new Error("stats must be a non-empty array");
  }

  // Validate and normalize each stat
  const validatedStats = stats.map((stat, index) => {
    if (typeof stat !== "object" || stat === null) {
      throw new Error(`stats[${index}] must be an object`);
    }

    const { value, label, display_order, is_active } = stat;

    if (value === undefined || value === null || !String(value).trim()) {
      throw new Error(`stats[${index}].value is required`);
    }

    if (label === undefined || label === null || !String(label).trim()) {
      throw new Error(`stats[${index}].label is required`);
    }

    if (display_order === undefined || display_order === null || display_order === "") {
      throw new Error(`stats[${index}].display_order is required`);
    }

    if (is_active === undefined || is_active === null || is_active === "") {
      throw new Error(`stats[${index}].is_active is required`);
    }

    const parsedDisplayOrder = parseNumber(display_order);
    if (typeof parsedDisplayOrder !== "number" || isNaN(parsedDisplayOrder)) {
      throw new Error(`stats[${index}].display_order must be a valid number`);
    }

    return {
      value: normalizeText(value),
      label: normalizeText(label),
      display_order: parsedDisplayOrder,
      is_active: parseBoolean(is_active),
    };
  });

  return validatedStats;
};

/**
 * Filters stats to include only active ones and sorts by display_order.
 */
const filterAndSortStats = (stats) => {
  return stats
    .filter((stat) => stat.is_active === true)
    .sort((a, b) => a.display_order - b.display_order);
};

/**
 * Uploads req.file (field name: backgroundImage) to ImageKit.
 * Folder convention: imcamhub/solutionspage
 */
const uploadBackgroundImage = async (req) => {
  if (!req.file) {
    throw new Error("backgroundImage is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "solutions-page-background",
    "imcamhub/solutionspage"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /solutions-page
 * Returns all active Solutions Page sections, sorted by displayOrder.
 * Stats are filtered to show only active stats, sorted by displayOrder.
 */
async function getPublicSolutionsPageSections(req, res) {
  try {
    const sections = await SolutionsPageSection.find({ is_active: true })
      .sort({ display_order: 1 })
      .lean();

    // Transform stats to include only active ones, sorted by displayOrder
    const transformedSections = sections.map((section) => ({
      ...section,
      stats: filterAndSortStats(section.stats),
    }));

    return res.status(200).json({
      success: true,
      message: "Solutions Page sections fetched successfully",
      data: transformedSections,
    });
  } catch (error) {
    console.error("Get Public Solutions Page Sections Error:", error);
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
 * POST /admin/solutions-page
 * Creates a new Solutions Page section.
 * Accepts multipart/form-data.
 * backgroundImage file is required on creation.
 * stats is sent as a JSON string and must be parsed.
 */
async function createSolutionsPageSection(req, res) {
  try {
    // Image is required on create
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "backgroundImage is required",
      });
    }

    // Validate required text fields
    const { title, description, display_order, is_active, stats } = req.body;

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

    if (
      display_order === undefined ||
      display_order === null ||
      display_order === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "display_order is required",
      });
    }

    const parsedDisplayOrder = parseNumber(display_order);
    if (typeof parsedDisplayOrder !== "number" || isNaN(parsedDisplayOrder)) {
      return res.status(400).json({
        success: false,
        message: "display_order must be a valid number",
      });
    }

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    // Parse and validate stats
    let validatedStats;
    try {
      validatedStats = parseAndValidateStats(stats);
    } catch (statsError) {
      return res.status(400).json({
        success: false,
        message: statsError.message,
      });
    }

    // Upload image to ImageKit
    let uploadedUrl;
    try {
      uploadedUrl = await uploadBackgroundImage(req);
    } catch (uploadError) {
      console.error("Solutions Page Background Image Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    const section = await SolutionsPageSection.create({
      ...(req.body.badge_text !== undefined && {
        badge_text: normalizeText(req.body.badge_text),
      }),
      title: normalizeText(title),
      ...(req.body.highlighted_title !== undefined && {
        highlighted_title: normalizeText(req.body.highlighted_title),
      }),
      description: normalizeText(description),
      background_image: uploadedUrl,
      stats: validatedStats,
      is_active: parseBoolean(is_active),
      display_order: parsedDisplayOrder,
    });

    return res.status(201).json({
      success: true,
      message: "Solutions Page section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create Solutions Page Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions-page
 * Returns all Solutions Page sections (active + inactive).
 * Includes all stats (active + inactive).
 */
async function getAllSolutionsPageSections(req, res) {
  try {
    const sections = await SolutionsPageSection.find().sort({
      display_order: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Solutions Page sections fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Get All Solutions Page Sections Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions-page/:id
 * Returns a single Solutions Page section by ID.
 */
async function getSolutionsPageSectionById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Page section id",
      });
    }

    const section = await SolutionsPageSection.findById(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Solutions Page section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Page section fetched successfully",
      data: section,
    });
  } catch (error) {
    console.error("Get Solutions Page Section By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/solutions-page/:id
 * Updates an existing Solutions Page section by ID.
 * If a new backgroundImage file is uploaded, it replaces the stored URL.
 * If no file is uploaded, the existing backgroundImage URL is preserved.
 */
async function updateSolutionsPageSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Page section id",
      });
    }

    const existing = await SolutionsPageSection.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Solutions Page section not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    [
      "badge_text",
      "title",
      "highlighted_title",
      "description",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Update numeric fields
    if (req.body.display_order !== undefined) {
      const parsedDisplayOrder = parseNumber(req.body.display_order);
      if (typeof parsedDisplayOrder !== "number" || isNaN(parsedDisplayOrder)) {
        return res.status(400).json({
          success: false,
          message: "display_order must be a valid number",
        });
      }
      updatePayload.display_order = parsedDisplayOrder;
    }

    // Update boolean fields
    if (req.body.is_active !== undefined) {
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    // Parse and validate stats if provided
    if (req.body.stats !== undefined) {
      try {
        updatePayload.stats = parseAndValidateStats(req.body.stats);
      } catch (statsError) {
        return res.status(400).json({
          success: false,
          message: statsError.message,
        });
      }
    }

    // Upload new image only when a file was provided
    if (req.file) {
      try {
        const newUrl = await uploadBackgroundImage(req);
        updatePayload.background_image = newUrl;
      } catch (uploadError) {
        console.error("Solutions Page Background Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. The existing image was not changed.",
        });
      }
    }
    // No file → backgroundImage stays untouched in the database

    const updated = await SolutionsPageSection.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Solutions Page section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Solutions Page Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/solutions-page/:id
 * Deletes a specific Solutions Page section by ID.
 */
async function deleteSolutionsPageSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Page section id",
      });
    }

    const section = await SolutionsPageSection.findByIdAndDelete(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Solutions Page section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Page section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.error("Delete Solutions Page Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/solutions-page/:id/status
 * Updates only the is_active status of a Solutions Page section.
 */
async function toggleSolutionsPageSectionStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Page section id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const section = await SolutionsPageSection.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Solutions Page section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Page section status updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Toggle Solutions Page Section Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicSolutionsPageSections,
  createSolutionsPageSection,
  getAllSolutionsPageSections,
  getSolutionsPageSectionById,
  updateSolutionsPageSection,
  deleteSolutionsPageSection,
  toggleSolutionsPageSectionStatus,
};
