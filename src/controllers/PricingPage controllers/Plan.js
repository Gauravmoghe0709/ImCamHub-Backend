const { isValidObjectId } = require("mongoose");
const Plan = require("../../model/Pricingpagemodel/Plan");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizePlan = (record) => {
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
    displayOrder: record.displayOrder,
    isActive: record.isActive,
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
 * Create Plan
 * @route POST /admin/pricing/plans
 * @access Admin (Protected)
 * Maximum 3 plans allowed
 */
async function createPlan(req, res) {
  try {
    const requiredFields = ["planName", "price", "billingPeriod", "displayOrder"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Check maximum 3 plans limit
    const existingPlansCount = await Plan.countDocuments();

    if (existingPlansCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "A maximum of 3 pricing plans can be created.",
      });
    }

    const plan = await Plan.create({
      planName: normalizeText(req.body.planName),
      price: normalizeText(req.body.price),
      billingPeriod: normalizeText(req.body.billingPeriod),
      description: normalizeText(req.body.description) || "",
      highlightedText: normalizeText(req.body.highlightedText) || "",
      isPopular: req.body.isPopular || false,
      popularText: normalizeText(req.body.popularText) || "",
      displayOrder: parseInt(req.body.displayOrder) || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: sanitizePlan(plan),
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get All Plans (Admin)
 * @route GET /admin/pricing/plans
 * @access Admin (Protected)
 */
async function getPlans(req, res) {
  try {
    const plans = await Plan.find().sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully",
      data: plans.map(sanitizePlan),
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Single Plan by ID (Admin)
 * @route GET /admin/pricing/plans/:id
 * @access Admin (Protected)
 */
async function getPlanById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Plan ID",
      });
    }

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: sanitizePlan(plan),
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update Plan
 * @route PUT /admin/pricing/plans/:id
 * @access Admin (Protected)
 */
async function updatePlan(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Plan ID",
      });
    }

    const existingPlan = await Plan.findById(id);

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    const updatePayload = {};

    // Update fields if provided
    const textFields = ["planName", "price", "billingPeriod", "description", "highlightedText", "popularText"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Handle boolean fields
    if (req.body.isPopular !== undefined) {
      updatePayload.isPopular = req.body.isPopular;
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = req.body.isActive;
    }

    // Handle numeric fields
    if (req.body.displayOrder !== undefined) {
      updatePayload.displayOrder = parseInt(req.body.displayOrder);
    }

    const updatedPlan = await Plan.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: sanitizePlan(updatedPlan),
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete Plan
 * @route DELETE /admin/pricing/plans/:id
 * @access Admin (Protected)
 */
async function deletePlan(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Plan ID",
      });
    }

    const plan = await Plan.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
      data: sanitizePlan(plan),
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Active Plans (Public)
 * @route GET /pricing/plans
 * @access Public (No Authentication)
 * Returns only active plans sorted by displayOrder
 */
async function getPublicPlans(req, res) {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      data: plans.map(sanitizePlan),
    });
  } catch (error) {
    console.error("Error fetching public plans:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPublicPlans,
};
