const { isValidObjectId } = require("mongoose");
const CaseworkerDailyWorkflow = require("../../model/CaseworkerPortalmodel/CaseworkerDailyWorkflow");
const uploadImage = require("../../services/Storage.services");

// ---------------------------------------------------------------------------
// Helpers — same pattern as CaseworkerPortalContent.controller.js
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

/**
 * Parses and validates the features field.
 * Accepts a JSON string (multipart) or a plain array.
 * Returns { features, error } — error is null on success.
 */
const parseFeatures = (raw) => {
  let parsed;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { features: null, error: "features must be a valid JSON array of strings" };
    }
  } else {
    parsed = raw;
  }

  if (!Array.isArray(parsed)) {
    return { features: null, error: "features must be an array" };
  }

  for (let i = 0; i < parsed.length; i++) {
    if (typeof parsed[i] !== "string" || !parsed[i].trim()) {
      return {
        features: null,
        error: `features[${i}] must be a non-empty string`,
      };
    }
  }

  return { features: parsed.map((f) => f.trim()), error: null };
};

/**
 * Uploads req.file (field name: section_image) to ImageKit using the existing service.
 * Folder convention: imcamhub/caseworkerportal/dailyworkflow
 */
const uploadSectionImage = async (req) => {
  if (!req.file) {
    throw new Error("section_image is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "caseworker-daily-workflow-image",
    "imcamhub/caseworkerportal/dailyworkflow"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal/day-in-the-life
 * Returns the active Caseworker Daily Workflow section (public, no auth).
 */
async function getPublicCaseworkerDailyWorkflow(req, res) {
  try {
    const record = await CaseworkerDailyWorkflow.findOne({
      is_active: true,
    }).sort({ created_at: -1 });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "No active Caseworker Daily Workflow section found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Daily Workflow section fetched successfully",
      data: record,
    });
  } catch (error) {
    console.error("Get Public Caseworker Daily Workflow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

async function getAllCaseworkerDailyWorkflow(req, res) {
  try {
    const records = await CaseworkerDailyWorkflow.find().sort({
      created_at: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Caseworker Daily Workflow records fetched successfully",
      data: records,
    });
  } catch (error) {
    console.error("Get All Caseworker Daily Workflow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
async function createCaseworkerDailyWorkflow(req, res) {
  try {
    // Image is required on create
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "section_image is required",
      });
    }

    // Validate required text fields
    const requiredTextFields = [
      "badge_text",
      "heading",
      "description",
      "secondary_description",
    ];
    for (const field of requiredTextFields) {
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

    // Validate features
    if (req.body.features === undefined || req.body.features === null) {
      return res.status(400).json({
        success: false,
        message: "features is required",
      });
    }
    const { features, error: featuresError } = parseFeatures(req.body.features);
    if (featuresError) {
      return res.status(400).json({ success: false, message: featuresError });
    }

    if (
      req.body.is_active === undefined ||
      req.body.is_active === null ||
      req.body.is_active === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    // Upload image to ImageKit
    let uploadedUrl;
    try {
      uploadedUrl = await uploadSectionImage(req);
    } catch (uploadError) {
      console.error("Caseworker Daily Workflow Image Upload Error:", uploadError);
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    const record = await CaseworkerDailyWorkflow.create({
      badge_text: normalizeText(req.body.badge_text),
      heading: normalizeText(req.body.heading),
      description: normalizeText(req.body.description),
      secondary_description: normalizeText(req.body.secondary_description),
      features,
      section_image: uploadedUrl,
      is_active: parseBoolean(req.body.is_active),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Daily Workflow section created successfully",
      data: record,
    });
  } catch (error) {
    console.error("Create Caseworker Daily Workflow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/caseworker-portal/day-in-the-life/:id
 * Updates an existing record by ID.
 * If a new section_image is uploaded it replaces the stored URL.
 * If no file is uploaded the existing section_image is preserved.
 */
async function updateCaseworkerDailyWorkflow(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Daily Workflow id",
      });
    }

    const existing = await CaseworkerDailyWorkflow.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Daily Workflow record not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    [
      "badge_text",
      "heading",
      "description",
      "secondary_description",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Update features array if provided
    if (req.body.features !== undefined) {
      const { features, error: featuresError } = parseFeatures(req.body.features);
      if (featuresError) {
        return res
          .status(400)
          .json({ success: false, message: featuresError });
      }
      updatePayload.features = features;
    }

    if (req.body.is_active !== undefined) {
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    // Upload new image only when a file was provided
    if (req.file) {
      try {
        const newUrl = await uploadSectionImage(req);
        updatePayload.section_image = newUrl;
      } catch (uploadError) {
        console.error("Caseworker Daily Workflow Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload failed. The existing image was not changed.",
        });
      }
    }
    // No file → section_image stays untouched in the database

    const updated = await CaseworkerDailyWorkflow.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Daily Workflow section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Daily Workflow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/caseworker-portal/day-in-the-life/:id
 * Deletes a record by ID.
 */
async function deleteCaseworkerDailyWorkflow(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Daily Workflow id",
      });
    }

    const record = await CaseworkerDailyWorkflow.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Daily Workflow record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Daily Workflow section deleted successfully",
      data: record,
    });
  } catch (error) {
    console.error("Delete Caseworker Daily Workflow Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/caseworker-portal/day-in-the-life/:id/status
 * Sets is_active explicitly using req.body.is_active.
 * Mirrors toggleCaseworkerPortalContentStatus pattern.
 */
async function toggleCaseworkerDailyWorkflowStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Daily Workflow id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const record = await CaseworkerDailyWorkflow.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Daily Workflow record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Daily Workflow status updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Toggle Caseworker Daily Workflow Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getPublicCaseworkerDailyWorkflow,
  getAllCaseworkerDailyWorkflow,
  createCaseworkerDailyWorkflow,
  updateCaseworkerDailyWorkflow,
  deleteCaseworkerDailyWorkflow,
  toggleCaseworkerDailyWorkflowStatus,
};
