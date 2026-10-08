const { isValidObjectId } = require("mongoose");
const PricingCard = require("../../model/Pricingpagemodel/PricingCard.model");

const MAX_FEATURES_PER_CATEGORY = 5;
const MIN_FEATURES_PER_CATEGORY = 1;

/**
 * Sanitize pricing card for response
 */
const sanitizePricingCard = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    planName: record.planName || "",
    price: record.price || "",
    billingPeriod: record.billingPeriod || "",
    description: record.description || "",
    highlightedText: record.highlightedText || "",
    isPopular: record.isPopular || false,
    popularText: record.popularText || "",
    buttonText: record.buttonText || "",
    buttonLink: record.buttonLink || "",
    categories: (record.categories || []).map((cat) => ({
      _id: cat._id,
      categoryName: cat.categoryName || "",
      features: cat.features || [],
    })),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

/**
 * Validate required fields
 */
const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (
      payload[field] === undefined ||
      payload[field] === null ||
      (typeof payload[field] === "string" && !String(payload[field]).trim())
    ) {
      return field;
    }
  }
  return null;
};

/**
 * Validate features array for a category
 */
const validateCategoryFeatures = (features) => {
  if (!Array.isArray(features)) {
    return "Features must be an array";
  }
  if (features.length < MIN_FEATURES_PER_CATEGORY) {
    return `Features array must contain at least ${MIN_FEATURES_PER_CATEGORY} item`;
  }
  if (features.length > MAX_FEATURES_PER_CATEGORY) {
    return `Features array cannot contain more than ${MAX_FEATURES_PER_CATEGORY} items`;
  }
  return null;
};

/**
 * Create a new Pricing Card (Admin)
 * @route POST /admin/home/pricing
 * @access Admin (Protected)
 */
async function createPricingCard(req, res) {
  try {
    // Validate required root-level fields (don't validate categories with validateRequiredFields)
    if (!req.body.planName || !String(req.body.planName).trim()) {
      return res.status(400).json({
        success: false,
        message: "planName is required",
      });
    }
    if (!req.body.price || !String(req.body.price).trim()) {
      return res.status(400).json({
        success: false,
        message: "price is required",
      });
    }
    if (!req.body.billingPeriod || !String(req.body.billingPeriod).trim()) {
      return res.status(400).json({
        success: false,
        message: "billingPeriod is required",
      });
    }
    if (!req.body.buttonText || !String(req.body.buttonText).trim()) {
      return res.status(400).json({
        success: false,
        message: "buttonText is required",
      });
    }
    if (!req.body.buttonLink || !String(req.body.buttonLink).trim()) {
      return res.status(400).json({
        success: false,
        message: "buttonLink is required",
      });
    }

    // Validate categories array
    if (!Array.isArray(req.body.categories) || req.body.categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one category is required",
      });
    }

    // Validate each category
    for (const category of req.body.categories) {
      if (!category.categoryName || !String(category.categoryName).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name is required for all categories",
        });
      }

      const featuresError = validateCategoryFeatures(category.features);
      if (featuresError) {
        return res.status(400).json({
          success: false,
          message: `Category "${category.categoryName}": ${featuresError}`,
        });
      }
    }

    // Validate isPopular and popularText relationship
    if (req.body.isPopular && !req.body.popularText) {
      return res.status(400).json({
        success: false,
        message: "Popular text is required when isPopular is true",
      });
    }

    const pricingCardData = {
      planName: req.body.planName.trim(),
      price: req.body.price.trim(),
      billingPeriod: req.body.billingPeriod.trim(),
      description: req.body.description ? req.body.description.trim() : "",
      highlightedText: req.body.highlightedText ? req.body.highlightedText.trim() : "",
      isPopular: req.body.isPopular || false,
      popularText: req.body.popularText ? req.body.popularText.trim() : "",
      buttonText: req.body.buttonText.trim(),
      buttonLink: req.body.buttonLink.trim(),
      categories: req.body.categories.map((cat) => ({
        categoryName: String(cat.categoryName).trim(),
        features: cat.features.map((f) => String(f).trim()),
      })),
    };

    const newPricingCard = await PricingCard.create(pricingCardData);

    return res.status(201).json({
      success: true,
      message: "Pricing card created successfully",
      data: sanitizePricingCard(newPricingCard),
    });
  } catch (error) {
    console.error("Create Pricing Card Error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create pricing card",
    });
  }
}

/**
 * Get all Pricing Cards (Admin)
 * @route GET /admin/home/pricing
 * @access Admin (Protected)
 */
async function getAllPricingCards(req, res) {
  try {
    const pricingCards = await PricingCard.find();

    return res.status(200).json({
      success: true,
      message: "Pricing cards retrieved successfully",
      data: pricingCards.map(sanitizePricingCard),
    });
  } catch (error) {
    console.error("Get All Pricing Cards Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pricing cards",
    });
  }
}

/**
 * Get Pricing Card by ID (Admin)
 * @route GET /admin/home/pricing/:id
 * @access Admin (Protected)
 */
async function getPricingCardById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing card retrieved successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Get Pricing Card by ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pricing card",
    });
  }
}

/**
 * Update Pricing Card (Admin)
 * @route PUT /admin/home/pricing/:id
 * @access Admin (Protected)
 */
async function updatePricingCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    // Validate categories if provided
    if (req.body.categories !== undefined) {
      if (!Array.isArray(req.body.categories) || req.body.categories.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one category is required",
        });
      }

      // Validate each category
      for (const category of req.body.categories) {
        if (!category.categoryName || !String(category.categoryName).trim()) {
          return res.status(400).json({
            success: false,
            message: "Category name is required for all categories",
          });
        }

        const featuresError = validateCategoryFeatures(category.features);
        if (featuresError) {
          return res.status(400).json({
            success: false,
            message: `Category "${category.categoryName}": ${featuresError}`,
          });
        }
      }
    }

    // Validate isPopular and popularText relationship
    if (
      req.body.isPopular === true &&
      (!req.body.popularText && !pricingCard.popularText)
    ) {
      return res.status(400).json({
        success: false,
        message: "Popular text is required when isPopular is true",
      });
    }

    // Prepare update data with trimming for string fields
    const updateData = {};
    const stringFields = [
      "planName",
      "price",
      "billingPeriod",
      "description",
      "highlightedText",
      "popularText",
      "buttonText",
      "buttonLink",
    ];

    for (const field of stringFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = String(req.body[field]).trim();
      }
    }

    // Handle boolean fields
    if (req.body.isPopular !== undefined) {
      updateData.isPopular = req.body.isPopular;
    }

    // Handle categories array
    if (req.body.categories !== undefined) {
      updateData.categories = req.body.categories.map((cat) => ({
        categoryName: String(cat.categoryName).trim(),
        features: cat.features.map((f) => String(f).trim()),
      }));
    }

    const updatedPricingCard = await PricingCard.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Pricing card updated successfully",
      data: sanitizePricingCard(updatedPricingCard),
    });
  } catch (error) {
    console.error("Update Pricing Card Error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update pricing card",
    });
  }
}

/**
 * Delete Pricing Card (Admin)
 * @route DELETE /admin/home/pricing/:id
 * @access Admin (Protected)
 */
async function deletePricingCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    await PricingCard.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Pricing card deleted successfully",
    });
  } catch (error) {
    console.error("Delete Pricing Card Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete pricing card",
    });
  }
}

/**
 * Get all Pricing Cards (Public)
 * @route GET /home/pricing
 * @access Public
 */
async function getPublicPricingCards(req, res) {
  try {
    const pricingCards = await PricingCard.find();

    return res.status(200).json({
      success: true,
      message: "Pricing cards retrieved successfully",
      data: pricingCards.map(sanitizePricingCard),
    });
  } catch (error) {
    console.error("Get Public Pricing Cards Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pricing cards",
    });
  }
}

/**
 * Get Pricing Card by ID (Public)
 * @route GET /home/pricing/:id
 * @access Public
 */
async function getPublicPricingCardById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pricing card retrieved successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Get Public Pricing Card by ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve pricing card",
    });
  }
}

/**
 * Add a new category to a pricing card (Admin)
 * @route POST /admin/home/pricing/:id/categories
 * @access Admin (Protected)
 */
async function addCategory(req, res) {
  try {
    const { id } = req.params;
    const { categoryName, features } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    if (!categoryName || !String(categoryName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const featuresError = validateCategoryFeatures(features);
    if (featuresError) {
      return res.status(400).json({
        success: false,
        message: featuresError,
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    const newCategory = {
      categoryName: String(categoryName).trim(),
      features: features.map((f) => String(f).trim()),
    };

    pricingCard.categories.push(newCategory);
    await pricingCard.save();

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Add Category Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add category",
    });
  }
}

/**
 * Update a category in a pricing card (Admin)
 * @route PUT /admin/home/pricing/:id/categories/:categoryId
 * @access Admin (Protected)
 */
async function updateCategory(req, res) {
  try {
    const { id, categoryId } = req.params;
    const { categoryName, features } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    const category = pricingCard.categories.id(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (categoryName !== undefined) {
      if (!String(categoryName).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty",
        });
      }
      category.categoryName = String(categoryName).trim();
    }

    if (features !== undefined) {
      const featuresError = validateCategoryFeatures(features);
      if (featuresError) {
        return res.status(400).json({
          success: false,
          message: featuresError,
        });
      }
      category.features = features.map((f) => String(f).trim());
    }

    await pricingCard.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
}

/**
 * Delete a category from a pricing card (Admin)
 * @route DELETE /admin/home/pricing/:id/categories/:categoryId
 * @access Admin (Protected)
 */
async function deleteCategory(req, res) {
  try {
    const { id, categoryId } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    const category = pricingCard.categories.id(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (pricingCard.categories.length <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last category. At least one category is required.",
      });
    }

    pricingCard.categories.id(categoryId).deleteOne();
    await pricingCard.save();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
}

/**
 * Add a feature to a category (Admin)
 * @route POST /admin/home/pricing/:id/categories/:categoryId/features
 * @access Admin (Protected)
 */
async function addFeature(req, res) {
  try {
    const { id, categoryId } = req.params;
    const { feature } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    if (!feature || !String(feature).trim()) {
      return res.status(400).json({
        success: false,
        message: "Feature is required",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    const category = pricingCard.categories.id(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.features.length >= MAX_FEATURES_PER_CATEGORY) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_FEATURES_PER_CATEGORY} features per category allowed`,
      });
    }

    category.features.push(String(feature).trim());
    await pricingCard.save();

    return res.status(201).json({
      success: true,
      message: "Feature added successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Add Feature Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add feature",
    });
  }
}

/**
 * Remove a feature from a category (Admin)
 * @route DELETE /admin/home/pricing/:id/categories/:categoryId/features/:featureIndex
 * @access Admin (Protected)
 */
async function removeFeature(req, res) {
  try {
    const { id, categoryId, featureIndex } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pricing card ID",
      });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const index = parseInt(featureIndex, 10);
    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid feature index",
      });
    }

    const pricingCard = await PricingCard.findById(id);

    if (!pricingCard) {
      return res.status(404).json({
        success: false,
        message: "Pricing card not found",
      });
    }

    const category = pricingCard.categories.id(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (index >= category.features.length) {
      return res.status(400).json({
        success: false,
        message: "Feature index out of range",
      });
    }

    if (category.features.length <= MIN_FEATURES_PER_CATEGORY) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${MIN_FEATURES_PER_CATEGORY} feature per category required`,
      });
    }

    category.features.splice(index, 1);
    await pricingCard.save();

    return res.status(200).json({
      success: true,
      message: "Feature removed successfully",
      data: sanitizePricingCard(pricingCard),
    });
  } catch (error) {
    console.error("Remove Feature Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove feature",
    });
  }
}

module.exports = {
  createPricingCard,
  getAllPricingCards,
  getPricingCardById,
  updatePricingCard,
  deletePricingCard,
  getPublicPricingCards,
  getPublicPricingCardById,
  addCategory,
  updateCategory,
  deleteCategory,
  addFeature,
  removeFeature,
};
