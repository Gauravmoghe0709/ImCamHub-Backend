const { isValidObjectId } = require("mongoose");
const CTA = require("../../model/Pricingpagemodel/CTA");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeCTA = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    buttonText: record.buttonText || "",
    buttonLink: record.buttonLink || "",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      return field;
    }
  }
  return null;
};

/**
 * Create CTA
 * @route POST /admin/pricing/cta
 * @access Admin (Protected)
 */
async function createCTA(req, res) {
  try {
    const requiredFields = ["buttonText", "buttonLink"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const cta = await CTA.create({
      buttonText: normalizeText(req.body.buttonText),
      buttonLink: normalizeText(req.body.buttonLink),
    });

    return res.status(201).json({
      success: true,
      message: "CTA created successfully",
      data: sanitizeCTA(cta),
    });
  } catch (error) {
    console.error("Error creating CTA:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get All CTAs (Admin)
 * @route GET /admin/pricing/cta
 * @access Admin (Protected)
 */
async function getCTAs(req, res) {
  try {
    const ctas = await CTA.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "CTAs fetched successfully",
      data: ctas.map(sanitizeCTA),
    });
  } catch (error) {
    console.error("Error fetching CTAs:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Single CTA by ID (Admin)
 * @route GET /admin/pricing/cta/:id
 * @access Admin (Protected)
 */
async function getCTAById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CTA ID",
      });
    }

    const cta = await CTA.findById(id);

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CTA fetched successfully",
      data: sanitizeCTA(cta),
    });
  } catch (error) {
    console.error("Error fetching CTA:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update CTA
 * @route PUT /admin/pricing/cta/:id
 * @access Admin (Protected)
 */
async function updateCTA(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CTA ID",
      });
    }

    const existingCTA = await CTA.findById(id);

    if (!existingCTA) {
      return res.status(404).json({
        success: false,
        message: "CTA not found",
      });
    }

    const updatePayload = {};

    // Update fields if provided
    const textFields = ["buttonText", "buttonLink"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    const updatedCTA = await CTA.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "CTA updated successfully",
      data: sanitizeCTA(updatedCTA),
    });
  } catch (error) {
    console.error("Error updating CTA:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete CTA
 * @route DELETE /admin/pricing/cta/:id
 * @access Admin (Protected)
 */
async function deleteCTA(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CTA ID",
      });
    }

    const cta = await CTA.findByIdAndDelete(id);

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CTA deleted successfully",
      data: sanitizeCTA(cta),
    });
  } catch (error) {
    console.error("Error deleting CTA:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Public CTA
 * @route GET /pricing/cta
 * @access Public (No Authentication)
 * Returns the latest/current CTA
 */
async function getPublicCTA(req, res) {
  try {
    const cta = await CTA.findOne().sort({ createdAt: -1 });

    if (!cta) {
      return res.status(404).json({
        success: false,
        message: "CTA not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeCTA(cta),
    });
  } catch (error) {
    console.error("Error fetching public CTA:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createCTA,
  getCTAs,
  getCTAById,
  updateCTA,
  deleteCTA,
  getPublicCTA,
};
