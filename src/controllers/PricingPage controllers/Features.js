const { isValidObjectId } = require("mongoose");
const Features = require("../../model/Pricingpagemodel/Features");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeFeatures = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    categoryName: record.categoryName || "",
    features: record.features || [],
    displayOrder: record.displayOrder,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null) {
      return field;
    }
    if (field === "categoryName" && String(payload[field]).trim() === "") {
      return field;
    }
  }
  return null;
};

/**
 * Create Feature Category
 * @route POST /admin/pricing/features
 * @access Admin (Protected)
 * Maximum 5 features per category
 */
async function createFeatureCategory(req, res) {
  try {
    const requiredFields = ["categoryName", "features", "displayOrder"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Validate features array
    if (!Array.isArray(req.body.features)) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array",
      });
    }

    if (req.body.features.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Features array must contain at least 1 feature",
      });
    }

    if (req.body.features.length > 5) {
      return res.status(400).json({
        success: false,
        message: "A maximum of 5 features can be added to a category.",
      });
    }

    // Trim all features
    const trimmedFeatures = req.body.features.map((f) => normalizeText(f));

    const featureCategory = await Features.create({
      categoryName: normalizeText(req.body.categoryName),
      features: trimmedFeatures,
      displayOrder: parseInt(req.body.displayOrder) || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Feature category created successfully",
      data: sanitizeFeatures(featureCategory),
    });
  } catch (error) {
    console.error("Error creating feature category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get All Feature Categories (Admin)
 * @route GET /admin/pricing/features
 * @access Admin (Protected)
 */
async function getFeatureCategories(req, res) {
  try {
    const categories = await Features.find().sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Feature categories fetched successfully",
      data: categories.map(sanitizeFeatures),
    });
  } catch (error) {
    console.error("Error fetching feature categories:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Single Feature Category by ID (Admin)
 * @route GET /admin/pricing/features/:id
 * @access Admin (Protected)
 */
async function getFeatureCategoryById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Feature Category ID",
      });
    }

    const category = await Features.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Feature category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature category fetched successfully",
      data: sanitizeFeatures(category),
    });
  } catch (error) {
    console.error("Error fetching feature category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update Feature Category
 * @route PUT /admin/pricing/features/:id
 * @access Admin (Protected)
 * Maximum 5 features per category must be enforced
 */
async function updateFeatureCategory(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Feature Category ID",
      });
    }

    const existingCategory = await Features.findById(id);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Feature category not found",
      });
    }

    const updatePayload = {};

    // Update categoryName if provided
    if (req.body.categoryName !== undefined && req.body.categoryName !== null) {
      updatePayload.categoryName = normalizeText(req.body.categoryName);
    }

    // Update features if provided
    if (req.body.features !== undefined && req.body.features !== null) {
      if (!Array.isArray(req.body.features)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array",
        });
      }

      if (req.body.features.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Features array must contain at least 1 feature",
        });
      }

      if (req.body.features.length > 5) {
        return res.status(400).json({
          success: false,
          message: "A maximum of 5 features can be added to a category.",
        });
      }

      updatePayload.features = req.body.features.map((f) => normalizeText(f));
    }

    // Handle boolean field
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = req.body.isActive;
    }

    // Handle numeric field
    if (req.body.displayOrder !== undefined) {
      updatePayload.displayOrder = parseInt(req.body.displayOrder);
    }

    const updatedCategory = await Features.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Feature category updated successfully",
      data: sanitizeFeatures(updatedCategory),
    });
  } catch (error) {
    console.error("Error updating feature category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete Feature Category
 * @route DELETE /admin/pricing/features/:id
 * @access Admin (Protected)
 */
async function deleteFeatureCategory(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Feature Category ID",
      });
    }

    const category = await Features.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Feature category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature category deleted successfully",
      data: sanitizeFeatures(category),
    });
  } catch (error) {
    console.error("Error deleting feature category:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Active Feature Categories (Public)
 * @route GET /pricing/features
 * @access Public (No Authentication)
 * Returns only active categories sorted by displayOrder
 */
async function getPublicFeatureCategories(req, res) {
  try {
    const categories = await Features.find({ isActive: true }).sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      data: categories.map(sanitizeFeatures),
    });
  } catch (error) {
    console.error("Error fetching public feature categories:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createFeatureCategory,
  getFeatureCategories,
  getFeatureCategoryById,
  updateFeatureCategory,
  deleteFeatureCategory,
  getPublicFeatureCategories,
};
