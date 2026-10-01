const { isValidObjectId } = require("mongoose");
const PricingPageHeader = require("../../model/Pricingpagemodel/PricingPageHeader.model");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeHeader = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    title: record.title || "",
    highlightedText: record.highlightedText || "",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || !String(payload[field]).trim()) {
      return field;
    }
  }

  return null;
};

/**
 * Create FAQ Header
 * @route POST /admin/pricing-page/faq-header
 * @access Admin (Protected)
 */
async function createPricingPageHeader(req, res) {
  try {
    const requiredFields = ["title"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Check if a header already exists (singleton pattern)
    const existingHeader = await PricingPageHeader.findOne();

    if (existingHeader) {
      return res.status(409).json({
        success: false,
        message: "FAQ Header already exists. Please update the existing record instead of creating a new one.",
        data: sanitizeHeader(existingHeader),
      });
    }

    const header = await PricingPageHeader.create({
      title: normalizeText(req.body.title),
      highlightedText: normalizeText(req.body.highlightedText) || "",
    });

    return res.status(201).json({
      success: true,
      message: "FAQ Header created successfully",
      data: sanitizeHeader(header),
    });
  } catch (error) {
    console.error("Error creating FAQ header:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get FAQ Header for Admin
 * @route GET /admin/pricing-page/faq-header
 * @access Admin (Protected)
 */
async function getPricingPageHeader(req, res) {
  try {
    const header = await PricingPageHeader.findOne().sort({ createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "FAQ Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ Header fetched successfully",
      data: sanitizeHeader(header),
    });
  } catch (error) {
    console.error("Error fetching FAQ header:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update FAQ Header
 * @route PUT /admin/pricing-page/faq-header/:id
 * @access Admin (Protected)
 */
async function updatePricingPageHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ Header ID",
      });
    }

    const existingHeader = await PricingPageHeader.findById(id);

    if (!existingHeader) {
      return res.status(404).json({
        success: false,
        message: "FAQ Header not found",
      });
    }

    const updatePayload = {};

    // Update fields if provided
    const textFields = ["title", "highlightedText"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    const updatedHeader = await PricingPageHeader.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ Header updated successfully",
      data: sanitizeHeader(updatedHeader),
    });
  } catch (error) {
    console.error("Error updating FAQ header:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete FAQ Header
 * @route DELETE /admin/pricing-page/faq-header/:id
 * @access Admin (Protected)
 */
async function deletePricingPageHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ Header ID",
      });
    }

    const header = await PricingPageHeader.findByIdAndDelete(id);

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "FAQ Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ Header deleted successfully",
      data: sanitizeHeader(header),
    });
  } catch (error) {
    console.error("Error deleting FAQ header:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Public FAQ Header
 * @route GET /pricing-page/faq-header
 * @access Public (No Authentication)
 */
async function getPublicPricingPageHeader(req, res) {
  try {
    const header = await PricingPageHeader.findOne().sort({ updatedAt: -1, createdAt: -1 });

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "FAQ Header not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeHeader(header),
    });
  } catch (error) {
    console.error("Error fetching public FAQ header:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createPricingPageHeader,
  getPricingPageHeader,
  updatePricingPageHeader,
  deletePricingPageHeader,
  getPublicPricingPageHeader,
};
