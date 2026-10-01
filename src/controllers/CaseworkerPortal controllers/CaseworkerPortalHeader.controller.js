const { isValidObjectId } = require("mongoose");
const CaseworkerPortalHeader = require("../../model/CaseworkerPortalmodel/CaseworkerPortalHeader");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid Caseworker Portal Header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal/header
 * Returns the most recent Caseworker Portal Header (public, no auth).
 */
async function getCaseworkerPortalHeader(req, res) {
  try {
    const headers = await CaseworkerPortalHeader.find().sort({ createdAt: -1 });

    if (!headers.length) {
      return res.status(404).json({
        success: false,
        message: "No Caseworker Portal Header found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal Header fetched successfully",
      data: headers,
    });
  } catch (error) {
    console.error("Get Caseworker Portal Header Error:", error);
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
 * POST /admin/caseworker-portal/header
 * Creates a new Caseworker Portal Header record — singleton: one record only.
 */
async function createCaseworkerPortalHeader(req, res) {
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

    // Singleton guard
    const existing = await CaseworkerPortalHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "Caseworker Portal Header already exists. Use PUT /admin/caseworker-portal/header/:id to update it.",
      });
    }

    const header = await CaseworkerPortalHeader.create({
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Portal Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create Caseworker Portal Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/caseworker-portal/header/:id
 * Updates an existing Caseworker Portal Header by ID.
 */
async function updateCaseworkerPortalHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal Header id",
      });
    }

    const existing = await CaseworkerPortalHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal Header not found",
      });
    }

    const updatePayload = {};
    ["title", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    const updated = await CaseworkerPortalHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Portal Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/caseworker-portal/header/:id
 * Deletes a Caseworker Portal Header by ID.
 * Does NOT affect Cards — completely independent.
 */
async function deleteCaseworkerPortalHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal Header id",
      });
    }

    const header = await CaseworkerPortalHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete Caseworker Portal Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getCaseworkerPortalHeader,
  createCaseworkerPortalHeader,
  updateCaseworkerPortalHeader,
  deleteCaseworkerPortalHeader,
};
