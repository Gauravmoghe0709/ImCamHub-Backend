const { isValidObjectId } = require("mongoose");
const FooterLogo = require("../../model/Footer/FooterLogo");
const uploadImage = require("../../services/Storage.services");

// ---------------------------------------------------------------------------
// Helpers
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
    return { status: 400, message: "Invalid footer logo data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Uploads req.file (field name: logo) to ImageKit using the existing service.
 * Folder: imcamhub/footer/logo
 */
const uploadLogoImage = async (req) => {
  if (!req.file) {
    throw new Error("logo file is required");
  }
  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "footer-logo",
    "imcamhub/footer/logo"
  );
  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /footer/logo
 * Returns the active footer logo section (public, no auth).
 */
async function getPublicFooterLogo(req, res) {
  try {
    const logo = await FooterLogo.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "No active footer logo found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Footer logo fetched successfully",
      data: logo,
    });
  } catch (error) {
    console.error("Get Public Footer Logo Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/footer/logo
 * Returns all footer logo records (active + inactive).
 */
async function getFooterLogo(req, res) {
  try {
    const logos = await FooterLogo.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Footer logo fetched successfully",
      data: logos,
    });
  } catch (error) {
    console.error("Get Footer Logo Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/footer/logo
 * Creates a new footer logo record.
 * Accepts multipart/form-data — logo handled by existing Multer middleware.
 */
async function createFooterLogo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "logo is required" });
    }

    if (
      req.body.isActive === undefined ||
      req.body.isActive === null ||
      req.body.isActive === ""
    ) {
      return res.status(400).json({ success: false, message: "isActive is required" });
    }

    let uploadedUrl;
    try {
      uploadedUrl = await uploadLogoImage(req);
    } catch (uploadError) {
      console.error("Footer Logo Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Logo upload failed. Please try again.",
      });
    }

    const logo = await FooterLogo.create({
      logo: uploadedUrl,
      ...(req.body.description !== undefined && {
        description: normalizeText(req.body.description),
      }),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Footer logo created successfully",
      data: logo,
    });
  } catch (error) {
    console.error("Create Footer Logo Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/footer/logo/:id
 * Updates an existing footer logo record.
 * New image is optional — if omitted the existing logo URL is preserved.
 */
async function updateFooterLogo(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid footer logo id" });
    }

    const existing = await FooterLogo.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Footer logo not found" });
    }

    const updatePayload = {};

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    // Upload new logo only when a file is provided
    if (req.file) {
      try {
        const newUrl = await uploadLogoImage(req);
        updatePayload.logo = newUrl;
      } catch (uploadError) {
        console.error("Footer Logo Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Logo upload failed. Existing logo was not changed.",
        });
      }
    }

    const updated = await FooterLogo.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Footer logo updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Footer Logo Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/footer/logo/:id
 * Deletes a footer logo record by ID.
 */
async function deleteFooterLogo(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid footer logo id" });
    }

    const logo = await FooterLogo.findByIdAndDelete(id);
    if (!logo) {
      return res.status(404).json({ success: false, message: "Footer logo not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Footer logo deleted successfully",
      data: logo,
    });
  } catch (error) {
    console.error("Delete Footer Logo Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getPublicFooterLogo,
  getFooterLogo,
  createFooterLogo,
  updateFooterLogo,
  deleteFooterLogo,
};
