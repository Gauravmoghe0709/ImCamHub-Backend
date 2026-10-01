const { isValidObjectId } = require("mongoose");
const CaseworkerPortalContent = require("../../model/CaseworkerPortalmodel/CaseworkerPortalContent");
const uploadImage = require("../../services/Storage.services");

// ---------------------------------------------------------------------------
// Helpers — same pattern as CaseworkerPortalHero.controllers.js
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

/**
 * Uploads req.file (field name: hero_image) to ImageKit using the existing service.
 * Folder convention: imcamhub/caseworkerportal/content
 */
const uploadHeroImage = async (req) => {
  if (!req.file) {
    throw new Error("hero_image is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "caseworker-portal-content-image",
    "imcamhub/caseworkerportal/content"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal
 * Returns the active Caseworker Portal content (public, no auth required).
 */
async function getPublicCaseworkerPortalContent(req, res) {
  try {
    const content = await CaseworkerPortalContent.findOne({
      is_active: true,
    }).sort({ created_at: -1 });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "No active Caseworker Portal content found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal content fetched successfully",
      data: content,
    });
  } catch (error) {
    console.error("Get Public Caseworker Portal Content Error:", error);
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
 * GET /admin/caseworker-portal
 * Returns all Caseworker Portal content records (active + inactive).
 */
async function getAllCaseworkerPortalContent(req, res) {
  try {
    const records = await CaseworkerPortalContent.find().sort({
      created_at: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal content fetched successfully",
      data: records,
    });
  } catch (error) {
    console.error("Get All Caseworker Portal Content Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/caseworker-portal/:id
 * Returns a single Caseworker Portal content record by ID.
 */
async function getCaseworkerPortalContentById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal content id",
      });
    }

    const content = await CaseworkerPortalContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal content fetched successfully",
      data: content,
    });
  } catch (error) {
    console.error("Get Caseworker Portal Content By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/caseworker-portal
 * Creates a new Caseworker Portal content record.
 * Accepts multipart/form-data — hero_image handled by existing Multer middleware.
 * hero_image file is required on creation.
 */
async function createCaseworkerPortalContent(req, res) {
  try {
    // Image is required on create
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "hero_image is required",
      });
    }

    // Validate required text fields
    const requiredFields = ["badge_text", "heading", "description"];
    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        !String(req.body[field]).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (
      req.body.is_active === undefined ||
      req.body.is_active === null ||
      req.body.is_active === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    // Upload image to ImageKit
    let uploadedUrl;
    try {
      uploadedUrl = await uploadHeroImage(req);
    } catch (uploadError) {
      console.error("Caseworker Portal Content Image Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    const content = await CaseworkerPortalContent.create({
      badge_text: normalizeText(req.body.badge_text),
      heading: normalizeText(req.body.heading),
      description: normalizeText(req.body.description),
      ...(req.body.secondary_description !== undefined && {
        secondary_description: normalizeText(req.body.secondary_description),
      }),
      hero_image: uploadedUrl,
      is_active: parseBoolean(req.body.is_active),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Portal content created successfully",
      data: content,
    });
  } catch (error) {
    console.error("Create Caseworker Portal Content Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/caseworker-portal/:id
 * Updates an existing Caseworker Portal content record by ID.
 * If a new hero_image file is uploaded, it replaces the stored URL.
 * If no file is uploaded, the existing hero_image URL is preserved.
 */
async function updateCaseworkerPortalContent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal content id",
      });
    }

    const existing = await CaseworkerPortalContent.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal content not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    ["badge_text", "heading", "description", "secondary_description"].forEach(
      (field) => {
        if (req.body[field] !== undefined) {
          updatePayload[field] = normalizeText(req.body[field]);
        }
      }
    );

    if (req.body.is_active !== undefined) {
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    // Upload new image only when a file was provided
    if (req.file) {
      try {
        const newUrl = await uploadHeroImage(req);
        updatePayload.hero_image = newUrl;
      } catch (uploadError) {
        console.error("Caseworker Portal Content Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. The existing image was not changed.",
        });
      }
    }
    // No file → hero_image stays untouched in the database

    const updated = await CaseworkerPortalContent.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal content updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Portal Content Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/caseworker-portal/:id
 * Deletes a specific Caseworker Portal content record by ID.
 */
async function deleteCaseworkerPortalContent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal content id",
      });
    }

    const content = await CaseworkerPortalContent.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal content deleted successfully",
      data: content,
    });
  } catch (error) {
    console.error("Delete Caseworker Portal Content Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/caseworker-portal/:id/status
 * Sets is_active explicitly using req.body.is_active.
 * Mirrors toggleCaseworkerPortalHeroStatus pattern.
 */
async function toggleCaseworkerPortalContentStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal content id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const content = await CaseworkerPortalContent.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal content status updated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Toggle Caseworker Portal Content Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicCaseworkerPortalContent,
  getAllCaseworkerPortalContent,
  getCaseworkerPortalContentById,
  createCaseworkerPortalContent,
  updateCaseworkerPortalContent,
  deleteCaseworkerPortalContent,
  toggleCaseworkerPortalContentStatus,
};
