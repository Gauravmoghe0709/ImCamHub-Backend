const { isValidObjectId } = require("mongoose");
const AdminDashboardFeaturesHeader = require("../../model/AdminDashboardmodel/AdminDashboardFeaturesHeader");
const AdminDashboardFeatureCard = require("../../model/AdminDashboardmodel/AdminDashboardFeatureCard");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_FEATURE_CARDS = 6;

// ---------------------------------------------------------------------------
// Helpers — same pattern as existing Featurespage controllers
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

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid data provided" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ===========================================================================
// PUBLIC CONTROLLERS
// ===========================================================================

/**
 * GET /admin-dashboard/features/header
 * Returns the active features header (public, no auth required).
 */
async function getPublicAdminDashboardFeaturesHeader(req, res) {
  try {
    const header = await AdminDashboardFeaturesHeader.findOne({
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No active Admin Dashboard Features header found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Features header fetched successfully",
      data: header,
    });
  } catch (error) {
    console.error("Get Public Admin Dashboard Features Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin-dashboard/features
 * Returns only active feature cards sorted by displayOrder ASC (public).
 */
async function getPublicAdminDashboardFeatureCards(req, res) {
  try {
    const cards = await AdminDashboardFeatureCard.find({
      isActive: true,
    }).sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Feature cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Get Public Admin Dashboard Feature Cards Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin-dashboard/features-section
 * Combined public endpoint — active header + active cards sorted by displayOrder ASC.
 */
async function getPublicAdminDashboardFeaturesSection(req, res) {
  try {
    const [header, cards] = await Promise.all([
      AdminDashboardFeaturesHeader.findOne({ isActive: true }).sort({
        createdAt: -1,
      }),
      AdminDashboardFeatureCard.find({ isActive: true }).sort({
        displayOrder: 1,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Features section fetched successfully",
      data: {
        header: header || null,
        features: cards,
      },
    });
  } catch (error) {
    console.error(
      "Get Public Admin Dashboard Features Section Error:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// ===========================================================================
// ADMIN — HEADER CONTROLLERS
// ===========================================================================

/**
 * GET /admin/dashboard/features/header
 * Returns the header regardless of isActive status.
 */
async function getAdminDashboardFeaturesHeader(req, res) {
  try {
    const headers = await AdminDashboardFeaturesHeader.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Features header fetched successfully",
      data: headers,
    });
  } catch (error) {
    console.error("Get Admin Dashboard Features Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/dashboard/features/header
 * Creates the features header — singleton: only one record allowed.
 */
async function createAdminDashboardFeaturesHeader(req, res) {
  try {
    // Validate required fields
    const requiredFields = ["heading", "description"];
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

    // Singleton guard — only one header allowed
    const existing = await AdminDashboardFeaturesHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "Admin Dashboard Features header already exists. Use PUT to update it.",
      });
    }

    const header = await AdminDashboardFeaturesHeader.create({
      heading: normalizeText(req.body.heading),
      description: normalizeText(req.body.description),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Admin Dashboard Features header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create Admin Dashboard Features Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/dashboard/features/header/:id
 * Updates the features header by ID.
 */
async function updateAdminDashboardFeaturesHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Features header id",
      });
    }

    const existing = await AdminDashboardFeaturesHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Features header not found",
      });
    }

    const updatePayload = {};
    ["heading", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    const updated = await AdminDashboardFeaturesHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Features header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Admin Dashboard Features Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/dashboard/features/header/:id
 * Deletes the features header by ID.
 */
async function deleteAdminDashboardFeaturesHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Dashboard Features header id",
      });
    }

    const header = await AdminDashboardFeaturesHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Admin Dashboard Features header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Features header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete Admin Dashboard Features Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// ===========================================================================
// ADMIN — FEATURE CARD CONTROLLERS
// ===========================================================================

/**
 * GET /admin/dashboard/features/cards
 * Returns all feature cards (active + inactive) sorted by displayOrder ASC.
 */
async function getAllAdminDashboardFeatureCards(req, res) {
  try {
    const cards = await AdminDashboardFeatureCard.find().sort({
      displayOrder: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Feature cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Get All Admin Dashboard Feature Cards Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/dashboard/features/cards/:id
 * Returns a single feature card by ID.
 */
async function getAdminDashboardFeatureCardById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feature card id",
      });
    }

    const card = await AdminDashboardFeatureCard.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Feature card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature card fetched successfully",
      data: card,
    });
  } catch (error) {
    console.error("Get Admin Dashboard Feature Card By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/dashboard/features/cards
 * Creates a new feature card — enforces a strict maximum of 6.
 * Limit counts ALL cards (active + inactive).
 */
async function createAdminDashboardFeatureCard(req, res) {
  try {
    // Validate required fields
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

    if (req.body.displayOrder === undefined || req.body.displayOrder === null) {
      return res.status(400).json({
        success: false,
        message: "displayOrder is required",
      });
    }

    if (!Number.isInteger(Number(req.body.displayOrder))) {
      return res.status(400).json({
        success: false,
        message: "displayOrder must be an integer",
      });
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

    // Enforce 6-card limit — counts ALL cards regardless of isActive
    const totalCards = await AdminDashboardFeatureCard.countDocuments();
    if (totalCards >= MAX_FEATURE_CARDS) {
      return res.status(409).json({
        success: false,
        message: "Maximum 6 feature cards are allowed.",
      });
    }

    const card = await AdminDashboardFeatureCard.create({
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
      displayOrder: Number(req.body.displayOrder),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Feature card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Admin Dashboard Feature Card Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/dashboard/features/cards/:id
 * Updates an existing feature card — the 6-card limit does NOT apply to updates.
 */
async function updateAdminDashboardFeatureCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feature card id",
      });
    }

    const existing = await AdminDashboardFeatureCard.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Feature card not found",
      });
    }

    const updatePayload = {};
    ["title", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    if (req.body.displayOrder !== undefined) {
      if (!Number.isInteger(Number(req.body.displayOrder))) {
        return res.status(400).json({
          success: false,
          message: "displayOrder must be an integer",
        });
      }
      updatePayload.displayOrder = Number(req.body.displayOrder);
    }

    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    const updated = await AdminDashboardFeatureCard.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Feature card updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Admin Dashboard Feature Card Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/dashboard/features/cards/:id
 * Deletes a feature card by ID.
 */
async function deleteAdminDashboardFeatureCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feature card id",
      });
    }

    const card = await AdminDashboardFeatureCard.findByIdAndDelete(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Feature card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Admin Dashboard Feature Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  // Public
  getPublicAdminDashboardFeaturesHeader,
  getPublicAdminDashboardFeatureCards,
  getPublicAdminDashboardFeaturesSection,
  // Admin — header
  getAdminDashboardFeaturesHeader,
  createAdminDashboardFeaturesHeader,
  updateAdminDashboardFeaturesHeader,
  deleteAdminDashboardFeaturesHeader,
  // Admin — cards
  getAllAdminDashboardFeatureCards,
  getAdminDashboardFeatureCardById,
  createAdminDashboardFeatureCard,
  updateAdminDashboardFeatureCard,
  deleteAdminDashboardFeatureCard,
};
