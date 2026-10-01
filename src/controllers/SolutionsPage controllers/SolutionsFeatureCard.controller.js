const { isValidObjectId } = require("mongoose");
const SolutionsFeatureCard = require("../../model/SolutionsPage model/SolutionsFeatureCard");
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
 * Uploads req.file (field name: image) to ImageKit using the existing service.
 * Folder convention: imcamhub/solutions/cards
 */
const uploadCardImage = async (req) => {
  if (!req.file) {
    throw new Error("image is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "solutions-card-image",
    "imcamhub/solutions/cards"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /solutions/cards
 * Returns all active Solutions Cards sorted by displayOrder (public, no auth required).
 */
async function getPublicSolutionsCards(req, res) {
  try {
    const cards = await SolutionsFeatureCard.find({ is_active: true })
      .sort({ display_order: 1 });

    return res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error("Get Public Solutions Cards Error:", error);
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
 * GET /admin/solutions/cards
 * Returns all Solutions Cards (active + inactive) sorted by displayOrder.
 */
async function getAdminSolutionsCards(req, res) {
  try {
    const cards = await SolutionsFeatureCard.find()
      .sort({ display_order: 1 });

    return res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error("Get Admin Solutions Cards Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions/cards/:id
 * Returns a single Solutions Card by ID.
 */
async function getSolutionsCardById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Card id",
      });
    }

    const card = await SolutionsFeatureCard.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Solutions Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error("Get Solutions Card By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/solutions/cards
 * Creates a new Solutions Card record.
 * Accepts multipart/form-data — image handled by existing Multer middleware.
 * image file is required on creation.
 */
async function createSolutionsCard(req, res) {
  try {
    // Image is required on create
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "image is required",
      });
    }

    // Validate required fields
    const { title, description, display_order, is_active } = req.body;

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

    // Upload image to ImageKit
    let uploadedUrl;
    try {
      uploadedUrl = await uploadCardImage(req);
    } catch (uploadError) {
      console.error("Solutions Card Image Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    const card = await SolutionsFeatureCard.create({
      title: normalizeText(title),
      description: normalizeText(description),
      image: uploadedUrl,
      display_order: parsedDisplayOrder,
      is_active: is_active !== undefined ? parseBoolean(is_active) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Solutions Card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Solutions Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/solutions/cards/:id
 * Updates an existing Solutions Card by ID.
 * If a new image file is uploaded, it replaces the stored URL.
 * If no file is uploaded, the existing image URL is preserved.
 */
async function updateSolutionsCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Card id",
      });
    }

    const existing = await SolutionsFeatureCard.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Solutions Card not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }

    // Update numeric field
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

    // Update boolean field
    if (req.body.is_active !== undefined) {
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    // Upload new image only when a file was provided
    if (req.file) {
      try {
        const newUrl = await uploadCardImage(req);
        updatePayload.image = newUrl;
      } catch (uploadError) {
        console.error("Solutions Card Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. The existing image was not changed.",
        });
      }
    }
    // No file → image stays untouched in the database

    const updated = await SolutionsFeatureCard.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Solutions Card updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Solutions Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/solutions/cards/:id
 * Deletes a specific Solutions Card by ID.
 */
async function deleteSolutionsCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Card id",
      });
    }

    const card = await SolutionsFeatureCard.findByIdAndDelete(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Solutions Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Solutions Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/solutions/cards/:id/status
 * Toggles the active/inactive status of a Solutions Card.
 */
async function toggleSolutionsCardStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Solutions Card id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const card = await SolutionsFeatureCard.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Solutions Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Solutions Card status updated successfully",
      data: card,
    });
  } catch (error) {
    console.error("Toggle Solutions Card Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicSolutionsCards,
  getAdminSolutionsCards,
  getSolutionsCardById,
  createSolutionsCard,
  updateSolutionsCard,
  deleteSolutionsCard,
  toggleSolutionsCardStatus,
};
