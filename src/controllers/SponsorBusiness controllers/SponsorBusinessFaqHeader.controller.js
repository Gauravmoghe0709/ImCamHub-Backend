const { isValidObjectId } = require("mongoose");
const SponsorBusinessFaqHeader = require("../../model/SponsorBusinessmodel/SponsorBusinessFaqHeader.model");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid SponsorBusiness Portal FAQ Header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /SponsorBusiness-portal/faq-header
 * Returns the SponsorBusiness Portal FAQ Header (public, no auth).
 */
async function getPublicSponsorBusinessFaqHeader(req, res) {
  try {
    const header = await SponsorBusinessFaqHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No SponsorBusiness Portal FAQ Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Public SponsorBusiness Portal FAQ Header Error:", error);
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
 * GET /admin/SponsorBusiness-portal/faq-header
 * Returns the SponsorBusiness Portal FAQ Header (admin).
 */
async function getSponsorBusinessFaqHeader(req, res) {
  try {
    const header = await SponsorBusinessFaqHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No SponsorBusiness Portal FAQ Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get SponsorBusiness Portal FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/SponsorBusiness-portal/faq-header
 * Creates a new SponsorBusiness Portal FAQ Header record — singleton: one record only.
 */
async function createSponsorBusinessFaqHeader(req, res) {
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
    const existing = await SponsorBusinessFaqHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "SponsorBusiness Portal FAQ Header already exists. Use PUT /admin/SponsorBusiness-portal/faq-header/:id to update it.",
      });
    }

    const header = await SponsorBusinessFaqHeader.create({
      title: normalizeText(req.body.title),
      ...(req.body.highlightedText !== undefined && {
        highlightedText: normalizeText(req.body.highlightedText),
      }),
    });

    return res.status(201).json({
      success: true,
      message: "SponsorBusiness Portal FAQ Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create SponsorBusiness Portal FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/SponsorBusiness-portal/faq-header/:id
 * Updates an existing SponsorBusiness Portal FAQ Header by ID.
 */
async function updateSponsorBusinessFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal FAQ Header id",
      });
    }

    const existing = await SponsorBusinessFaqHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal FAQ Header not found",
      });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }
    if (req.body.highlightedText !== undefined) {
      updatePayload.highlightedText = normalizeText(req.body.highlightedText);
    }

    const updated = await SponsorBusinessFaqHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal FAQ Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update SponsorBusiness Portal FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/SponsorBusiness-portal/faq-header/:id
 * Deletes a SponsorBusiness Portal FAQ Header by ID.
 * Does NOT affect FAQs — completely independent.
 */
async function deleteSponsorBusinessFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SponsorBusiness Portal FAQ Header id",
      });
    }

    const header = await SponsorBusinessFaqHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "SponsorBusiness Portal FAQ Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SponsorBusiness Portal FAQ Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete SponsorBusiness Portal FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicSponsorBusinessFaqHeader,
  getSponsorBusinessFaqHeader,
  createSponsorBusinessFaqHeader,
  updateSponsorBusinessFaqHeader,
  deleteSponsorBusinessFaqHeader,
};
