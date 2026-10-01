const { isValidObjectId } = require("mongoose");
const ClientPortalCta = require("../../model/ClientPortalmodel/ClientPortalCta");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1 || value === "1") return true;
  if (value === "false" || value === 0 || value === "0") return false;
  return value;
};

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid Caseworker Portal CTA data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal/cta
 * Returns the active Caseworker Portal CTA (public, no auth).
 * Only returns CTA if isActive = true
 */
async function getClientPortalCta(req, res) {
  try {
    const cta = await ClientPortalCta.findOne({ isActive: true });

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "No active Caseworker Portal CTA found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cta,
    });
  } catch (error) {
    console.error("Get Caseworker Portal CTA Error:", error);
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
 * POST /admin/caseworker-portal/cta
 * Creates a new Caseworker Portal CTA record.
 */
async function createClientPortalCta(req, res) {
  try {
    // Validate required fields
    const { heading, description, buttonText, buttonLink, isActive } = req.body;

    if (
      heading === undefined ||
      heading === null ||
      !String(heading).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "heading is required",
      });
    }

    if (
      description === undefined ||
      description === null ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }

    if (
      buttonText === undefined ||
      buttonText === null ||
      !String(buttonText).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "buttonText is required",
      });
    }

    if (
      buttonLink === undefined ||
      buttonLink === null ||
      !String(buttonLink).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "buttonLink is required",
      });
    }

    if (isActive === undefined || isActive === null || isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    const cta = await ClientPortalCta.create({
      heading: normalizeText(heading),
      ...(req.body.highlightedText !== undefined && {
        highlightedText: normalizeText(req.body.highlightedText),
      }),
      description: normalizeText(description),
      buttonText: normalizeText(buttonText),
      buttonLink: normalizeText(buttonLink),
      isActive: parseBoolean(isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Portal CTA created successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Create Caseworker Portal CTA Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * GET /admin/caseworker-portal/cta
 * Returns all Caseworker Portal CTA records (admin).
 */
async function getAllClientPortalCtas(req, res) {
  try {
    const ctas = await ClientPortalCta.find();

    return res.status(200).json({
      success: true,
      data: ctas,
    });
  } catch (error) {
    console.error("Get All Caseworker Portal CTAs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/caseworker-portal/cta/:id
 * Returns a single Caseworker Portal CTA by ID (admin).
 */
async function getClientPortalCtaById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal CTA id",
      });
    }

    const cta = await ClientPortalCta.findById(id);
    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: cta,
    });
  } catch (error) {
    console.error("Get Caseworker Portal CTA By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/caseworker-portal/cta/:id
 * Updates an existing Caseworker Portal CTA by ID.
 */
async function updateClientPortalCta(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal CTA id",
      });
    }

    const existing = await ClientPortalCta.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal CTA not found",
      });
    }

    const updatePayload = {};
    if (req.body.heading !== undefined) {
      updatePayload.heading = normalizeText(req.body.heading);
    }
    if (req.body.highlightedText !== undefined) {
      updatePayload.highlightedText = normalizeText(req.body.highlightedText);
    }
    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }
    if (req.body.buttonText !== undefined) {
      updatePayload.buttonText = normalizeText(req.body.buttonText);
    }
    if (req.body.buttonLink !== undefined) {
      updatePayload.buttonLink = normalizeText(req.body.buttonLink);
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    const updated = await ClientPortalCta.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal CTA updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Portal CTA Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/caseworker-portal/cta/:id
 * Deletes a Caseworker Portal CTA by ID.
 */
async function deleteClientPortalCta(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal CTA id",
      });
    }

    const cta = await ClientPortalCta.findByIdAndDelete(id);
    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal CTA deleted successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Delete Caseworker Portal CTA Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/caseworker-portal/cta/:id/status
 * Toggles the active/inactive status of a Caseworker Portal CTA.
 */
async function toggleClientPortalCtaStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal CTA id",
      });
    }

    const { isActive } = req.body;

    if (isActive === undefined || isActive === null || isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    const cta = await ClientPortalCta.findByIdAndUpdate(
      id,
      { isActive: parseBoolean(isActive) },
      { new: true, runValidators: true }
    );

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal CTA status updated successfully",
      data: cta,
    });
  } catch (error) {
    console.error("Toggle Caseworker Portal CTA Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getClientPortalCta,
  createClientPortalCta,
  getAllClientPortalCtas,
  getClientPortalCtaById,
  updateClientPortalCta,
  deleteClientPortalCta,
  toggleClientPortalCtaStatus,
};
