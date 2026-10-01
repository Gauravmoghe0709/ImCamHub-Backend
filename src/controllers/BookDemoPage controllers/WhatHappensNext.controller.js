const { isValidObjectId } = require("mongoose");
const WhatHappensNext = require("../../model/BookDemoPagemodel/WhatHappensNext.model");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeWhatHappensNext = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    sectionTitle: record.sectionTitle || "",
    steps: record.steps || [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null) {
      return field;
    }
  }
  return null;
};

/**
 * Create What Happens Next
 * @route POST /admin/book-demo/what-happens-next
 * @access Admin (Protected)
 */
async function createWhatHappensNext(req, res) {
  try {
    const requiredFields = ["sectionTitle", "steps"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Validate steps array
    if (!Array.isArray(req.body.steps)) {
      return res.status(400).json({
        success: false,
        message: "Steps must be an array",
      });
    }

    if (req.body.steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one step is required",
      });
    }

    // Validate each step has text
    for (let i = 0; i < req.body.steps.length; i++) {
      if (!req.body.steps[i].text || String(req.body.steps[i].text).trim() === "") {
        return res.status(400).json({
          success: false,
          message: `Step ${i + 1} must have text`,
        });
      }
    }

    const whatHappensNext = await WhatHappensNext.create({
      sectionTitle: normalizeText(req.body.sectionTitle),
      steps: req.body.steps.map((step) => ({
        text: normalizeText(step.text),
      })),
    });

    return res.status(201).json({
      success: true,
      message: "What Happens Next created successfully",
      data: sanitizeWhatHappensNext(whatHappensNext),
    });
  } catch (error) {
    console.error("Error creating What Happens Next:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get What Happens Next (Admin)
 * @route GET /admin/book-demo/what-happens-next
 * @access Admin (Protected)
 */
async function getWhatHappensNextAdmin(req, res) {
  try {
    const whatHappensNext = await WhatHappensNext.findOne().sort({ createdAt: -1 });

    if (!whatHappensNext) {
      return res.status(404).json({
        success: false,
        message: "What Happens Next section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "What Happens Next fetched successfully",
      data: sanitizeWhatHappensNext(whatHappensNext),
    });
  } catch (error) {
    console.error("Error fetching What Happens Next:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update What Happens Next
 * @route PUT /admin/book-demo/what-happens-next/:id
 * @access Admin (Protected)
 */
async function updateWhatHappensNext(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid What Happens Next ID",
      });
    }

    const existingRecord = await WhatHappensNext.findById(id);

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "What Happens Next section not found",
      });
    }

    const updatePayload = {};

    // Update sectionTitle if provided
    if (req.body.sectionTitle !== undefined && req.body.sectionTitle !== null) {
      updatePayload.sectionTitle = normalizeText(req.body.sectionTitle);
    }

    // Update steps if provided
    if (req.body.steps !== undefined && req.body.steps !== null) {
      if (!Array.isArray(req.body.steps)) {
        return res.status(400).json({
          success: false,
          message: "Steps must be an array",
        });
      }

      if (req.body.steps.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one step is required",
        });
      }

      // Validate each step has text
      for (let i = 0; i < req.body.steps.length; i++) {
        if (!req.body.steps[i].text || String(req.body.steps[i].text).trim() === "") {
          return res.status(400).json({
            success: false,
            message: `Step ${i + 1} must have text`,
          });
        }
      }

      updatePayload.steps = req.body.steps.map((step) => ({
        text: normalizeText(step.text),
      }));
    }

    const updatedRecord = await WhatHappensNext.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "What Happens Next updated successfully",
      data: sanitizeWhatHappensNext(updatedRecord),
    });
  } catch (error) {
    console.error("Error updating What Happens Next:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete What Happens Next
 * @route DELETE /admin/book-demo/what-happens-next/:id
 * @access Admin (Protected)
 */
async function deleteWhatHappensNext(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid What Happens Next ID",
      });
    }

    const record = await WhatHappensNext.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "What Happens Next section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "What Happens Next deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting What Happens Next:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Public What Happens Next
 * @route GET /book-demo/what-happens-next
 * @access Public (No Authentication)
 */
async function getPublicWhatHappensNext(req, res) {
  try {
    const whatHappensNext = await WhatHappensNext.findOne().sort({
      updatedAt: -1,
      createdAt: -1,
    });

    if (!whatHappensNext) {
      return res.status(404).json({
        success: false,
        message: "What Happens Next section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeWhatHappensNext(whatHappensNext),
    });
  } catch (error) {
    console.error("Error fetching public What Happens Next:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createWhatHappensNext,
  getWhatHappensNextAdmin,
  updateWhatHappensNext,
  deleteWhatHappensNext,
  getPublicWhatHappensNext,
};
