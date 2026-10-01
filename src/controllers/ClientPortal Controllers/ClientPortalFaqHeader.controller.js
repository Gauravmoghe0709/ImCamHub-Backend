const { isValidObjectId } = require("mongoose");
const ClientPortalFaqHeader = require("../../model/ClientPortalmodel/ClientPortalFaqHeader.model");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid ClientPortal Portal FAQ Header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /ClientPortal-portal/faq-header
 * Returns the ClientPortal Portal FAQ Header (public, no auth).
 */
async function getPublicClientPortalFaqHeader(req, res) {
  try {
    const header = await ClientPortalFaqHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No ClientPortal Portal FAQ Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get Public ClientPortal Portal FAQ Header Error:", error);
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
 * GET /admin/ClientPortal-portal/faq-header
 * Returns the ClientPortal Portal FAQ Header (admin).
 */
async function getClientPortalFaqHeader(req, res) {
  try {
    const header = await ClientPortalFaqHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "No ClientPortal Portal FAQ Header found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get ClientPortal Portal FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/ClientPortal-portal/faq-header
 * Creates a new ClientPortal Portal FAQ Header record — singleton: one record only.
 */
async function createClientPortalFaqHeader(req, res) {
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
    const existing = await ClientPortalFaqHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "ClientPortal Portal FAQ Header already exists. Use PUT /admin/ClientPortal-portal/faq-header/:id to update it.",
      });
    }

    const header = await ClientPortalFaqHeader.create({
      title: normalizeText(req.body.title),
      ...(req.body.highlightedText !== undefined && {
        highlightedText: normalizeText(req.body.highlightedText),
      }),
    });

    return res.status(201).json({
      success: true,
      message: "ClientPortal Portal FAQ Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create ClientPortal Portal FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/ClientPortal-portal/faq-header/:id
 * Updates an existing ClientPortal Portal FAQ Header by ID.
 */
async function updateClientPortalFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal FAQ Header id",
      });
    }

    const existing = await ClientPortalFaqHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal FAQ Header not found",
      });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }
    if (req.body.highlightedText !== undefined) {
      updatePayload.highlightedText = normalizeText(req.body.highlightedText);
    }

    const updated = await ClientPortalFaqHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal FAQ Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update ClientPortal Portal FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/ClientPortal-portal/faq-header/:id
 * Deletes a ClientPortal Portal FAQ Header by ID.
 * Does NOT affect FAQs — completely independent.
 */
async function deleteClientPortalFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal FAQ Header id",
      });
    }

    const header = await ClientPortalFaqHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal FAQ Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal FAQ Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete ClientPortal Portal FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicClientPortalFaqHeader,
  getClientPortalFaqHeader,
  createClientPortalFaqHeader,
  updateClientPortalFaqHeader,
  deleteClientPortalFaqHeader,
};
