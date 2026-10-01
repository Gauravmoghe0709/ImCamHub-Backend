const { isValidObjectId } = require("mongoose");
const ClientPortalHeader = require("../../model/ClientPortalmodel/ClientPortalHeader");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid ClientPortal Portal Header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /ClientPortal-portal/header
 * Returns the most recent ClientPortal Portal Header (public, no auth).
 */
async function getClientPortalHeader(req, res) {
  try {
    const headers = await ClientPortalHeader.find().sort({ createdAt: -1 });

    if (!headers.length) {
      return res.status(404).json({
        success: false,
        message: "No ClientPortal Portal Header found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal Header fetched successfully",
      data: headers,
    });
  } catch (error) {
    console.error("Get ClientPortal Portal Header Error:", error);
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
 * POST /admin/ClientPortal-portal/header
 * Creates a new ClientPortal Portal Header record — singleton: one record only.
 */
async function createClientPortalHeader(req, res) {
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
    const existing = await ClientPortalHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "ClientPortal Portal Header already exists. Use PUT /admin/ClientPortal-portal/header/:id to update it.",
      });
    }

    const header = await ClientPortalHeader.create({
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
    });

    return res.status(201).json({
      success: true,
      message: "ClientPortal Portal Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create ClientPortal Portal Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/ClientPortal-portal/header/:id
 * Updates an existing ClientPortal Portal Header by ID.
 */
async function updateClientPortalHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal Header id",
      });
    }

    const existing = await ClientPortalHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal Header not found",
      });
    }

    const updatePayload = {};
    ["title", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    const updated = await ClientPortalHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update ClientPortal Portal Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/ClientPortal-portal/header/:id
 * Deletes a ClientPortal Portal Header by ID.
 * Does NOT affect Cards — completely independent.
 */
async function deleteClientPortalHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ClientPortal Portal Header id",
      });
    }

    const header = await ClientPortalHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "ClientPortal Portal Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ClientPortal Portal Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete ClientPortal Portal Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getClientPortalHeader,
  createClientPortalHeader,
  updateClientPortalHeader,
  deleteClientPortalHeader,
};
