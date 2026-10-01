const { isValidObjectId } = require("mongoose");
const PricingPage = require("../../model/Pricingpagemodel/PricingPage.model");
const uploadImage = require("../../services/Storage.services");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizePricingPage = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    badgeText: record.badgeText || "",
    title: record.title || "",
    description: record.description || "",
    pricingLabel: record.pricingLabel || "",
    price: record.price || "",
    image: record.image || null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const uploadPricingImage = async (req) => {
  if (!req.file) {
    throw new Error("Image is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "pricing-page-image",
    "imcamhub/pricingpage"
  );

  return response?.url;
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
 * Create a new Pricing Page
 * @route POST /admin/pricing-page
 * @access Admin (Protected)
 */
async function createPricingPage(req, res) {
  try {
    const requiredFields = ["badgeText", "title", "description", "pricingLabel", "price"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Check if a pricing page already exists (singleton pattern)
    const existingPricingPage = await PricingPage.findOne();

    if (existingPricingPage) {
      return res.status(409).json({
        success: false,
        message: "Pricing Page already exists. Please update the existing record instead of creating a new one.",
        data: sanitizePricingPage(existingPricingPage),
      });
    }

    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      imageUrl = await uploadPricingImage(req);
    }

    const pricingPage = await PricingPage.create({
      badgeText: normalizeText(req.body.badgeText),
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
      pricingLabel: normalizeText(req.body.pricingLabel),
      price: normalizeText(req.body.price),
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Pricing Page created successfully",
      data: sanitizePricingPage(pricingPage),
    });
  } catch (error) {
    console.error("Error creating pricing page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Pricing Page for Admin
 * @route GET /admin/pricing-page
 * @access Admin (Protected)
 */
async function getPricingPageAdmin(req, res) {
  try {
    const pricingPage = await PricingPage.findOne().sort({ createdAt: -1 });

    if (!pricingPage) {
      return res.status(404).json({
        success: false,
        message: "Pricing Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing Page fetched successfully",
      data: sanitizePricingPage(pricingPage),
    });
  } catch (error) {
    console.error("Error fetching pricing page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update Pricing Page
 * @route PUT /admin/pricing-page/:id
 * @access Admin (Protected)
 */
async function updatePricingPage(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pricing Page ID",
      });
    }

    const existingPricingPage = await PricingPage.findById(id);

    if (!existingPricingPage) {
      return res.status(404).json({
        success: false,
        message: "Pricing Page not found",
      });
    }

    const updatePayload = {};

    // Update text fields if provided
    const textFields = ["badgeText", "title", "description", "pricingLabel", "price"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Upload new image if provided
    if (req.file) {
      const uploadedUrl = await uploadPricingImage(req);
      updatePayload.image = uploadedUrl;
    }

    const updatedPricingPage = await PricingPage.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Pricing Page updated successfully",
      data: sanitizePricingPage(updatedPricingPage),
    });
  } catch (error) {
    console.error("Error updating pricing page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete Pricing Page
 * @route DELETE /admin/pricing-page/:id
 * @access Admin (Protected)
 */
async function deletePricingPage(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pricing Page ID",
      });
    }

    const pricingPage = await PricingPage.findByIdAndDelete(id);

    if (!pricingPage) {
      return res.status(404).json({
        success: false,
        message: "Pricing Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing Page deleted successfully",
      data: sanitizePricingPage(pricingPage),
    });
  } catch (error) {
    console.error("Error deleting pricing page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Public Pricing Page
 * @route GET /pricing-page
 * @access Public (No Authentication)
 */
async function getPublicPricingPage(req, res) {
  try {
    const pricingPage = await PricingPage.findOne().sort({ updatedAt: -1, createdAt: -1 });

    if (!pricingPage) {
      return res.status(404).json({
        success: false,
        message: "Pricing Page not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizePricingPage(pricingPage),
    });
  } catch (error) {
    console.error("Error fetching public pricing page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createPricingPage,
  getPricingPageAdmin,
  updatePricingPage,
  deletePricingPage,
  getPublicPricingPage,
};
