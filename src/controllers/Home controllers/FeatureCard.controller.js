const { isValidObjectId } = require("mongoose");
const FeatureCard = require("../../model/Homepage/featureCard");

const MAX_FEATURE_CARDS = 5;
const allowedFields = ["title", "description", "display_order", "is_active"];

const validatePayload = (payload, requireRequiredFields = false) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Request body must be a JSON object";
  }

  const unknownField = Object.keys(payload).find((field) => !allowedFields.includes(field));
  if (unknownField) return `Unknown field: ${unknownField}`;

  // Validate title and description
  for (const field of ["title", "description"]) {
    if (requireRequiredFields && (typeof payload[field] !== "string" || !payload[field].trim())) {
      return `${field} is required and must not be empty`;
    }
    if (
      payload[field] !== undefined &&
      (typeof payload[field] !== "string" || !payload[field].trim())
    ) {
      return `${field} must be a non-empty string`;
    }
  }

  // Validate display_order
  if (payload.display_order !== undefined) {
    if (!Number.isInteger(payload.display_order)) {
      return "display_order must be an integer";
    }
  }

  // Validate is_active
  if (payload.is_active !== undefined && typeof payload.is_active !== "boolean") {
    return "is_active must be a boolean";
  }

  return null;
};

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid feature card data" };
  }

  return { status: 500, message: "Something went wrong." };
};

const normalizePayload = (payload) => ({
  ...payload,
  ...(payload.title !== undefined && { title: payload.title.trim() }),
  ...(payload.description !== undefined && { description: payload.description.trim() }),
});

async function createFeatureCard(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const totalCards = await FeatureCard.countDocuments();
    if (totalCards >= MAX_FEATURE_CARDS) {
      return res.status(409).json({
        success: false,
        message: "Maximum 5 feature cards are allowed.",
      });
    }

    const featureCard = await FeatureCard.create({
      ...normalizePayload(req.body),
      is_active: req.body.is_active === undefined ? true : req.body.is_active,
    });

    return res.status(201).json({
      success: true,
      message: "Feature card created successfully.",
      data: featureCard,
    });
  } catch (error) {
    console.error("Create Feature Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

async function getAllFeatureCards(req, res) {
  try {
    const featureCards = await FeatureCard.find().sort({ display_order: 1 });
    return res.status(200).json({ success: true, data: featureCards });
  } catch (error) {
    console.error("Get Feature Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

async function getFeatureCardById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid feature card id" });
    }

    const featureCard = await FeatureCard.findById(req.params.id);
    if (!featureCard) {
      return res.status(404).json({ success: false, message: "Feature card not found" });
    }

    return res.status(200).json({ success: true, data: featureCard });
  } catch (error) {
    console.error("Get Feature Card By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

async function updateFeatureCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid feature card id" });
    }

    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const featureCard = await FeatureCard.findByIdAndUpdate(
      req.params.id,
      normalizePayload(req.body),
      { new: true, runValidators: true }
    );

    if (!featureCard) {
      return res.status(404).json({ success: false, message: "Feature card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Feature card updated successfully.",
      data: featureCard,
    });
  } catch (error) {
    console.error("Update Feature Card Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

async function deleteFeatureCard(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid feature card id" });
    }

    const featureCard = await FeatureCard.findByIdAndDelete(req.params.id);
    if (!featureCard) {
      return res.status(404).json({ success: false, message: "Feature card not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Feature card deleted successfully.",
      data: featureCard,
    });
  } catch (error) {
    console.error("Delete Feature Card Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

async function getActiveFeatureCards(req, res) {
  try {
    const featureCards = await FeatureCard.find({ is_active: true }).sort({
      display_order: 1,
    });

    return res.status(200).json({ success: true, data: featureCards });
  } catch (error) {
    console.error("Get Active Feature Cards Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

module.exports = {
  createFeatureCard,
  getAllFeatureCards,
  getFeatureCardById,
  updateFeatureCard,
  deleteFeatureCard,
  getActiveFeatureCards,
};
