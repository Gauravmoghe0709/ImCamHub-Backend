const { isValidObjectId } = require("mongoose");
const FeaturePageCta = require("../../model/AdminDashboardmodel/featurePageCta");

// ---------------------------------------------------------------------------
// Helpers — same pattern as existing Featurespage controllers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid Feature Page CTA data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /admin-dashboard/cta
 * Returns the most recently created Feature Page CTA (public, no auth).
 */
async function getFeaturePageCta(req, res) {
  try {
    const cta = await FeaturePageCta.findOne().sort({ createdAt: -1 });

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "No Feature Page CTA found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature Page CTA fetched successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Get Feature Page CTA Error:", error);
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
 * GET /admin/admin-dashboard/cta
 * Returns all Feature Page CTA records.
 */
async function getAllFeaturePageCtas(req, res) {
  try {
    const ctas = await FeaturePageCta.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Feature Page CTAs fetched successfully",
      data: ctas,
    });
  } catch (error) {
    console.error("Get All Feature Page CTAs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/admin-dashboard/cta/:id
 * Returns a single Feature Page CTA by ID.
 */
async function getFeaturePageCtaById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Feature Page CTA id",
      });
    }

    const cta = await FeaturePageCta.findById(id);

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "Feature Page CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature Page CTA fetched successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Get Feature Page CTA By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/admin-dashboard/cta
 * Creates a new Feature Page CTA — singleton: only one record allowed.
 */
async function createFeaturePageCta(req, res) {
  try {
    // Validate required fields
    const requiredFields = ["title", "ctaText", "ctaLink"];
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

    // Singleton guard — only one CTA record allowed
    const existing = await FeaturePageCta.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "Feature Page CTA already exists. Use PUT /admin/admin-dashboard/cta/:id to update it.",
      });
    }

    const cta = await FeaturePageCta.create({
      title: normalizeText(req.body.title),
      ...(req.body.highlightedText !== undefined && {
        highlightedText: normalizeText(req.body.highlightedText),
      }),
      ...(req.body.description !== undefined && {
        description: normalizeText(req.body.description),
      }),
      ctaText: normalizeText(req.body.ctaText),
      ctaLink: normalizeText(req.body.ctaLink),
    });

    return res.status(201).json({
      success: true,
      message: "Feature Page CTA created successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Create Feature Page CTA Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/admin-dashboard/cta/:id
 * Updates an existing Feature Page CTA by ID (partial update supported).
 */
async function updateFeaturePageCta(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Feature Page CTA id",
      });
    }

    const existing = await FeaturePageCta.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Feature Page CTA not found",
      });
    }

    const updatePayload = {};
    const allFields = ["title", "highlightedText", "description", "ctaText", "ctaLink"];

    for (const field of allFields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    }

    const updated = await FeaturePageCta.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Feature Page CTA updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Feature Page CTA Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/admin-dashboard/cta/:id
 * Deletes a Feature Page CTA by ID.
 */
async function deleteFeaturePageCta(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Feature Page CTA id",
      });
    }

    const cta = await FeaturePageCta.findByIdAndDelete(id);

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "Feature Page CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature Page CTA deleted successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Delete Feature Page CTA Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getFeaturePageCta,
  getAllFeaturePageCtas,
  getFeaturePageCtaById,
  createFeaturePageCta,
  updateFeaturePageCta,
  deleteFeaturePageCta,
};
