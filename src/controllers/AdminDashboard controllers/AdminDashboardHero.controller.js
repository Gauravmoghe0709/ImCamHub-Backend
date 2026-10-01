const { isValidObjectId } = require("mongoose");
const AdminDashboardHero = require("../../model/AdminDashboardmodel/AdminDashboardHero.model");
const uploadImage = require("../../services/Storage.services");

// ---------------------------------------------------------------------------
// Helpers — same pattern as HeroSection.controller.js / PlatformSection.controller.js
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
 * Uploads req.file (field name: dashboardImage) to ImageKit.
 * Matches the multipart field name used in the route: upload.single("dashboardImage")
 * Folder convention: imcamhub/featurespages/admindashboardhero
 */
const uploadDashboardImage = async (req) => {
  if (!req.file) {
    throw new Error("dashboardImage is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "admin-dashboard-hero-image",
    "imcamhub/featurespages/admindashboardhero"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /api/public/admin-dashboard-hero
 * Returns the active Admin Dashboard Hero section (no auth required).
 */
async function getPublicAdminDashboardHero(req, res) {
  try {
    const hero = await AdminDashboardHero.findOne({ isActive: true }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "No active Admin Dashboard Hero section found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Hero fetched successfully",
      data: hero,
    });
  } catch (error) {
    console.error("Get Public Admin Dashboard Hero Error:", error);
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
 * GET /api/admin/dashboard/hero
 * Returns all Admin Dashboard Hero records (active + inactive).
 */
async function getAllAdminDashboardHeroes(req, res) {
  try {
    const heroes = await AdminDashboardHero.find().sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Heroes fetched successfully",
      data: heroes,
    });
  } catch (error) {
    console.error("Get All Admin Dashboard Heroes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /api/admin/dashboard/hero/:id
 * Returns a single Admin Dashboard Hero record by ID.
 */
async function getAdminDashboardHeroById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Hero id",
      });
    }

    const hero = await AdminDashboardHero.findById(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Hero not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Hero fetched successfully",
      data: hero,
    });
  } catch (error) {
    console.error("Get Admin Dashboard Hero By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /api/admin/dashboard/hero
 * Creates a new Admin Dashboard Hero record.
 * Accepts multipart/form-data — dashboardImage handled by existing Multer middleware.
 * dashboardImage (the file) is required on creation.
 */
async function createAdminDashboardHero(req, res) {
  try {
    // Image is required on create
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "dashboardImage is required",
      });
    }

    // Validate required text fields
    const requiredFields = ["title", "description"];
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
      uploadedUrl = await uploadDashboardImage(req);
    } catch (uploadError) {
      console.error("Admin Dashboard Hero Image Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    const hero = await AdminDashboardHero.create({
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
      backgroundImage: uploadedUrl,
      isActive: parseBoolean(req.body.isActive),
      ...(req.body.sortOrder !== undefined && {
        sortOrder: Number(req.body.sortOrder),
      }),
    });

    return res.status(201).json({
      success: true,
      message: "Admin Dashboard Hero created successfully",
      data: hero,
    });
  } catch (error) {
    console.error("Create Admin Dashboard Hero Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /api/admin/dashboard/hero/:id
 * Updates an existing Admin Dashboard Hero record by ID.
 * If a new dashboardImage file is uploaded, it replaces the stored URL.
 * If no file is uploaded, the existing backgroundImage is preserved.
 */
async function updateAdminDashboardHero(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Hero id",
      });
    }

    const existing = await AdminDashboardHero.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Hero not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    ["title", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    if (req.body.sortOrder !== undefined) {
      updatePayload.sortOrder = Number(req.body.sortOrder);
    }

    // Upload new image only when a file was provided
    if (req.file) {
      try {
        const newUrl = await uploadDashboardImage(req);
        updatePayload.backgroundImage = newUrl;
      } catch (uploadError) {
        console.error("Admin Dashboard Hero Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message:
            "Image upload failed. The existing image was not changed.",
        });
      }
    }
    // No file → backgroundImage stays untouched in the database

    const updated = await AdminDashboardHero.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Hero updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Admin Dashboard Hero Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /api/admin/dashboard/hero/:id
 * Deletes a specific Admin Dashboard Hero record by ID.
 */
async function deleteAdminDashboardHero(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Hero id",
      });
    }

    const hero = await AdminDashboardHero.findByIdAndDelete(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Hero not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Hero deleted successfully",
      data: hero,
    });
  } catch (error) {
    console.error("Delete Admin Dashboard Hero Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /api/admin/dashboard/hero/:id/status
 * Toggles the isActive status of a specific record.
 * Mirrors the toggleheroSectionStatus pattern from HeroSection.controller.js
 */
async function toggleAdminDashboardHeroStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Hero id",
      });
    }

    const { isActive } = req.body;

    if (isActive === undefined || isActive === null || isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    const hero = await AdminDashboardHero.findByIdAndUpdate(
      id,
      { isActive: parseBoolean(isActive) },
      { new: true, runValidators: true }
    );

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Hero not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Hero status updated successfully",
      data: hero,
    });
  } catch (error) {
    console.error("Toggle Admin Dashboard Hero Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicAdminDashboardHero,
  getAllAdminDashboardHeroes,
  getAdminDashboardHeroById,
  createAdminDashboardHero,
  updateAdminDashboardHero,
  deleteAdminDashboardHero,
  toggleAdminDashboardHeroStatus,
};
