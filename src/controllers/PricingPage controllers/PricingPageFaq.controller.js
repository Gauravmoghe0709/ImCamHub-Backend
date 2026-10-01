const { isValidObjectId } = require("mongoose");
const PricingPageFaq = require("../../model/Pricingpagemodel/PricingPageFaq.model");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeFaq = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    question: record.question || "",
    answer: record.answer || "",
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
 * Create FAQ
 * @route POST /admin/pricing-page/faqs
 * @access Admin (Protected)
 * IMPORTANT: Each call creates a NEW FAQ document. Unlimited FAQs allowed.
 */
async function createPricingPageFaq(req, res) {
  try {
    const requiredFields = ["question", "answer"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const faq = await PricingPageFaq.create({
      question: normalizeText(req.body.question),
      answer: normalizeText(req.body.answer),
    });

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: sanitizeFaq(faq),
    });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get All FAQs for Admin
 * @route GET /admin/pricing-page/faqs
 * @access Admin (Protected)
 */
async function getPricingPageFaqs(req, res) {
  try {
    const faqs = await PricingPageFaq.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      data: faqs.map(sanitizeFaq),
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Single FAQ by ID for Admin
 * @route GET /admin/pricing-page/faqs/:id
 * @access Admin (Protected)
 */
async function getPricingPageFaqById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    const faq = await PricingPageFaq.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ fetched successfully",
      data: sanitizeFaq(faq),
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update FAQ
 * @route PUT /admin/pricing-page/faqs/:id
 * @access Admin (Protected)
 * IMPORTANT: Updating one FAQ does not affect other FAQs.
 */
async function updatePricingPageFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    const existingFaq = await PricingPageFaq.findById(id);

    if (!existingFaq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    const updatePayload = {};

    // Update fields if provided
    const textFields = ["question", "answer"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Ensure at least one field is being updated
    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field (question or answer) must be provided for update",
      });
    }

    const updatedFaq = await PricingPageFaq.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: sanitizeFaq(updatedFaq),
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete FAQ
 * @route DELETE /admin/pricing-page/faqs/:id
 * @access Admin (Protected)
 * IMPORTANT: Deleting one FAQ does not affect other FAQs or the Header.
 */
async function deletePricingPageFaq(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
    }

    const faq = await PricingPageFaq.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
      data: sanitizeFaq(faq),
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get All Public FAQs
 * @route GET /pricing-page/faqs
 * @access Public (No Authentication)
 * IMPORTANT: Returns all FAQs. If no FAQs exist, returns empty array.
 */
async function getPublicPricingPageFaqs(req, res) {
  try {
    const faqs = await PricingPageFaq.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: faqs.map(sanitizeFaq),
    });
  } catch (error) {
    console.error("Error fetching public FAQs:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createPricingPageFaq,
  getPricingPageFaqs,
  getPricingPageFaqById,
  updatePricingPageFaq,
  deletePricingPageFaq,
  getPublicPricingPageFaqs,
};
