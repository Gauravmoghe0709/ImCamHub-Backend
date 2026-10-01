const { isValidObjectId } = require("mongoose");
const AdminDashboardIntro = require("../../model/AdminDashboardmodel/AdminDashboardIntro.model");
const uploadImage = require("../../services/Storage.services");

// ---------------------------------------------------------------------------
// Helpers — same pattern as AdminDashboardHero.controller.js
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
 * Uploads req.file (field name: image) to ImageKit using the existing service.
 * Folder: imcamhub/featurespages/admindashboardintro
 */
const uploadIntroImage = async (req) => {
  if (!req.file) {
    throw new Error("image file is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "admin-dashboard-intro-image",
    "imcamhub/featurespages/admindashboardintro"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /admin-dashboard/intro
 * Returns the active Admin Dashboard Intro section (no auth required).
 */
async function getPublicAdminDashboardIntro(req, res) {
  try {
    const intro = await AdminDashboardIntro.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!intro) {
      return res.status(404).json({
        success: false,
        message: "No active Admin Dashboard Intro section found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Intro fetched successfully",
      data: intro,
    });
  } catch (error) {
    console.error("Get Public Admin Dashboard Intro Error:", error);
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
 * GET /admin/dashboard/intro
 * Returns all Admin Dashboard Intro records (active + inactive).
 */
async function getAllAdminDashboardIntros(req, res) {
  try {
    const intros = await AdminDashboardIntro.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Intros fetched successfully",
      data: intros,
    });
  } catch (error) {
    console.error("Get All Admin Dashboard Intros Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/dashboard/intro/:id
 * Returns a single Admin Dashboard Intro record by ID.
 */
async function getAdminDashboardIntroById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Intro id",
      });
    }

    const intro = await AdminDashboardIntro.findById(id);

    if (!intro) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Intro not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Intro fetched successfully",
      data: intro,
    });
  } catch (error) {
    console.error("Get Admin Dashboard Intro By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/dashboard/intro
 * Creates a new Admin Dashboard Intro record.
 * Accepts multipart/form-data — image handled by existing Multer middleware.
 * image (the file) is required on creation.
 */
async function createAdminDashboardIntro(req, res) {
  try {
    // Image is required on create
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "image is required",
      });
    }

    // Validate required text fields
    const requiredFields = ["badgeText", "heading", "description1", "description2"];
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
      req.body.isActive === undefined ||
      req.body.isActive === null ||
      req.body.isActive === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    // Upload image to ImageKit
    let uploadedUrl;
    try {
      uploadedUrl = await uploadIntroImage(req);
    } catch (uploadError) {
      console.error("Admin Dashboard Intro Image Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    const intro = await AdminDashboardIntro.create({
      badgeText: normalizeText(req.body.badgeText),
      heading: normalizeText(req.body.heading),
      description1: normalizeText(req.body.description1),
      description2: normalizeText(req.body.description2),
      image: uploadedUrl,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Admin Dashboard Intro created successfully",
      data: intro,
    });
  } catch (error) {
    console.error("Create Admin Dashboard Intro Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/dashboard/intro/:id
 * Updates an existing Admin Dashboard Intro record by ID.
 * If a new image file is uploaded, it replaces the stored URL.
 * If no file is uploaded, the existing image URL is preserved.
 */
async function updateAdminDashboardIntro(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Intro id",
      });
    }

    const existing = await AdminDashboardIntro.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Intro not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    ["badgeText", "heading", "description1", "description2"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    // Upload new image only when a file was provided
    if (req.file) {
      try {
        const newUrl = await uploadIntroImage(req);
        updatePayload.image = newUrl;
      } catch (uploadError) {
        console.error("Admin Dashboard Intro Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. The existing image was not changed.",
        });
      }
    }
    // No file → image field stays untouched in the database

    const updated = await AdminDashboardIntro.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Intro updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Admin Dashboard Intro Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/dashboard/intro/:id
 * Deletes a specific Admin Dashboard Intro record by ID.
 */
async function deleteAdminDashboardIntro(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Intro id",
      });
    }

    const intro = await AdminDashboardIntro.findByIdAndDelete(id);

    if (!intro) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Intro not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Intro deleted successfully",
      data: intro,
    });
  } catch (error) {
    console.error("Delete Admin Dashboard Intro Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/dashboard/intro/:id/status
 * Explicitly sets isActive using the value from req.body.isActive.
 * Mirrors the toggleAdminDashboardHeroStatus pattern.
 */
async function toggleAdminDashboardIntroStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Intro id",
      });
    }

    const { isActive } = req.body;

    if (isActive === undefined || isActive === null || isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    const intro = await AdminDashboardIntro.findByIdAndUpdate(
      id,
      { isActive: parseBoolean(isActive) },
      { new: true, runValidators: true }
    );

    if (!intro) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Intro not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Intro status updated successfully",
      data: intro,
    });
  } catch (error) {
    console.error("Toggle Admin Dashboard Intro Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicAdminDashboardIntro,
  getAllAdminDashboardIntros,
  getAdminDashboardIntroById,
  createAdminDashboardIntro,
  updateAdminDashboardIntro,
  deleteAdminDashboardIntro,
  toggleAdminDashboardIntroStatus,
};
