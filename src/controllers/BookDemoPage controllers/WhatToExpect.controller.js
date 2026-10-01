const { isValidObjectId } = require("mongoose");
const WhatToExpect = require("../../model/BookDemoPagemodel/WhatToExpect.model");
const uploadImage = require("../../services/Storage.services");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeWhatToExpect = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    image: record.image || "",
    imageFileId: record.imageFileId || null,
    title: record.title || "",
    description: record.description || "",
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
 * Create What to Expect
 * @route POST /admin/book-demo/what-to-expect
 * @access Admin (Protected)
 */
async function createWhatToExpect(req, res) {
  try {
    const requiredFields = ["title", "description"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Upload image to ImageKit
    let uploadedImageUrl = null;
    let imageFileId = null;

    try {
      const imageResponse = await uploadImage(
        req.file.buffer,
        req.file.originalname || "what-to-expect-image",
        "imcamhub/book-demo/what-to-expect"
      );

      uploadedImageUrl = imageResponse.url;
      imageFileId = imageResponse.fileId || null;
    } catch (imageError) {
      console.error("ImageKit upload error:", imageError);
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: imageError.message,
      });
    }

    const whatToExpect = await WhatToExpect.create({
      image: uploadedImageUrl,
      imageFileId: imageFileId,
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
    });

    return res.status(201).json({
      success: true,
      message: "What to Expect created successfully",
      data: sanitizeWhatToExpect(whatToExpect),
    });
  } catch (error) {
    console.error("Error creating What to Expect:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get What to Expect (Admin)
 * @route GET /admin/book-demo/what-to-expect
 * @access Admin (Protected)
 */
async function getWhatToExpectAdmin(req, res) {
  try {
    const whatToExpect = await WhatToExpect.findOne().sort({ createdAt: -1 });

    if (!whatToExpect) {
      return res.status(404).json({
        success: false,
        message: "What to Expect section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "What to Expect fetched successfully",
      data: sanitizeWhatToExpect(whatToExpect),
    });
  } catch (error) {
    console.error("Error fetching What to Expect:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Update What to Expect
 * @route PUT /admin/book-demo/what-to-expect/:id
 * @access Admin (Protected)
 */
async function updateWhatToExpect(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid What to Expect ID",
      });
    }

    const existingRecord = await WhatToExpect.findById(id);

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "What to Expect section not found",
      });
    }

    const updatePayload = {};

    // Update text fields if provided
    const textFields = ["title", "description"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Handle image update if new image is provided
    if (req.file) {
      try {
        const imageResponse = await uploadImage(
          req.file.buffer,
          req.file.originalname || "what-to-expect-image",
          "imcamhub/book-demo/what-to-expect"
        );

        updatePayload.image = imageResponse.url;
        updatePayload.imageFileId = imageResponse.fileId || null;
      } catch (imageError) {
        console.error("ImageKit upload error:", imageError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload new image",
          error: imageError.message,
        });
      }
    }

    const updatedRecord = await WhatToExpect.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "What to Expect updated successfully",
      data: sanitizeWhatToExpect(updatedRecord),
    });
  } catch (error) {
    console.error("Error updating What to Expect:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Delete What to Expect
 * @route DELETE /admin/book-demo/what-to-expect/:id
 * @access Admin (Protected)
 */
async function deleteWhatToExpect(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid What to Expect ID",
      });
    }

    const record = await WhatToExpect.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "What to Expect section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "What to Expect deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting What to Expect:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

/**
 * Get Public What to Expect
 * @route GET /book-demo/what-to-expect
 * @access Public (No Authentication)
 */
async function getPublicWhatToExpect(req, res) {
  try {
    const whatToExpect = await WhatToExpect.findOne().sort({ updatedAt: -1, createdAt: -1 });

    if (!whatToExpect) {
      return res.status(404).json({
        success: false,
        message: "What to Expect section not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeWhatToExpect(whatToExpect),
    });
  } catch (error) {
    console.error("Error fetching public What to Expect:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createWhatToExpect,
  getWhatToExpectAdmin,
  updateWhatToExpect,
  deleteWhatToExpect,
  getPublicWhatToExpect,
};
