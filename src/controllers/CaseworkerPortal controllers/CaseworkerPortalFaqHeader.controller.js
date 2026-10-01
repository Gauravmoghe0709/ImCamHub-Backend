const { isValidObjectId } = require("mongoose");
const CaseworkerPortalFaqHeader = require("../../model/CaseworkerPortalmodel/CaseworkerPortalFaqHeader.model");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid Caseworker Portal FAQ Header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal/faq-header
 * Returns the Caseworker Portal FAQ Header (public, no auth).
 */
async function getPublicCaseworkerPortalFaqHeader(req, res) {
  try {
    const header = await CaseworkerPortalFaqHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No Caseworker Portal FAQ Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Public Caseworker Portal FAQ Header Error:", error);
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
 * GET /admin/caseworker-portal/faq-header
 * Returns the Caseworker Portal FAQ Header (admin).
 */
async function getCaseworkerPortalFaqHeader(req, res) {
  try {
    const header = await CaseworkerPortalFaqHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No Caseworker Portal FAQ Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Caseworker Portal FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/caseworker-portal/faq-header
 * Creates a new Caseworker Portal FAQ Header record — singleton: one record only.
 */
async function createCaseworkerPortalFaqHeader(req, res) {
  try {
    // Validate required fields
    if (
      req.body.title === undefined ||
      req.body.title === null ||
      !String(req.body.title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    // Singleton guard
    const existing = await CaseworkerPortalFaqHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "Caseworker Portal FAQ Header already exists. Use PUT /admin/caseworker-portal/faq-header/:id to update it.",
      });
    }

    const header = await CaseworkerPortalFaqHeader.create({
      title: normalizeText(req.body.title),
      ...(req.body.highlightedText !== undefined && {
        highlightedText: normalizeText(req.body.highlightedText),
      }),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Portal FAQ Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create Caseworker Portal FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/caseworker-portal/faq-header/:id
 * Updates an existing Caseworker Portal FAQ Header by ID.
 */
async function updateCaseworkerPortalFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal FAQ Header id",
      });
    }

    const existing = await CaseworkerPortalFaqHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal FAQ Header not found",
      });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }
    if (req.body.highlightedText !== undefined) {
      updatePayload.highlightedText = normalizeText(req.body.highlightedText);
    }

    const updated = await CaseworkerPortalFaqHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal FAQ Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Portal FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/caseworker-portal/faq-header/:id
 * Deletes a Caseworker Portal FAQ Header by ID.
 * Does NOT affect FAQs — completely independent.
 */
async function deleteCaseworkerPortalFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal FAQ Header id",
      });
    }

    const header = await CaseworkerPortalFaqHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal FAQ Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal FAQ Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete Caseworker Portal FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicCaseworkerPortalFaqHeader,
  getCaseworkerPortalFaqHeader,
  createCaseworkerPortalFaqHeader,
  updateCaseworkerPortalFaqHeader,
  deleteCaseworkerPortalFaqHeader,
};
