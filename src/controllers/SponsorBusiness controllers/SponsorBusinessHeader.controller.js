const { isValidObjectId } = require("mongoose");
const SponsorBusinessHeader = require("../../model/SponsorBusinessmodel/SponsorBusinessHeader");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid SponsorBusiness Portal Header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /SponsorBusiness-portal/header
 * Returns the most recent SponsorBusiness Portal Header (public, no auth).
 */
async function getSponsorBusinessHeader(req, res) {
  try {
    const headers = await SponsorBusinessHeader.find().sort({ createdAt: -1 });

    if (!headers.length) {
      return res.status(404).json({
        success: false,
        message: "No SponsorBusiness Portal Header found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal Header fetched successfully",
      data: headers,
    });
  } catch (error) {
    console.error("Get SponsorBusiness Portal Header Error:", error);
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
 * POST /admin/SponsorBusiness-portal/header
 * Creates a new SponsorBusiness Portal Header record — singleton: one record only.
 */
async function createSponsorBusinessHeader(req, res) {
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
    const existing = await SponsorBusinessHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "SponsorBusiness Portal Header already exists. Use PUT /admin/SponsorBusiness-portal/header/:id to update it.",
      });
    }

    const header = await SponsorBusinessHeader.create({
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
    });

    return res.status(201).json({
      success: true,
      message: "SponsorBusiness Portal Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create SponsorBusiness Portal Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/SponsorBusiness-portal/header/:id
 * Updates an existing SponsorBusiness Portal Header by ID.
 */
async function updateSponsorBusinessHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal Header id",
      });
    }

    const existing = await SponsorBusinessHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal Header not found",
      });
    }

    const updatePayload = {};
    ["title", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    const updated = await SponsorBusinessHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update SponsorBusiness Portal Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/SponsorBusiness-portal/header/:id
 * Deletes a SponsorBusiness Portal Header by ID.
 * Does NOT affect Cards — completely independent.
 */
async function deleteSponsorBusinessHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal Header id",
      });
    }

    const header = await SponsorBusinessHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete SponsorBusiness Portal Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getSponsorBusinessHeader,
  createSponsorBusinessHeader,
  updateSponsorBusinessHeader,
  deleteSponsorBusinessHeader,
};
