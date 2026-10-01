const { isValidObjectId } = require("mongoose");
const FaqHeader = require("../../model/AdminDashboardmodel/faqHeader");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid FAQ header data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public + Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin-dashboard/faq/header  (public)
 * GET /admin/dashboard/faq/header  (admin)
 * Returns the most recently created FAQ header.
 */
async function getFaqHeader(req, res) {
  try {
    const headers = await FaqHeader.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "FAQ header fetched successfully",
      data: headers,
    });
  } catch (error) {
    console.error("Get FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/dashboard/faq/header
 * Creates the FAQ header — singleton: only one record allowed.
 */
async function createFaqHeader(req, res) {
  try {
    // Validate required field
    if (
      req.body.title === undefined ||
      req.body.title === null ||
      !String(req.body.title).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    // Singleton guard
    const existing = await FaqHeader.countDocuments();
    if (existing >= 1) {
      return res.status(409).json({
        success: false,
        message:
          "FAQ header already exists. Use PUT /admin/dashboard/faq/header/:id to update it.",
      });
    }

    const header = await FaqHeader.create({
      title: normalizeText(req.body.title),
      ...(req.body.highlightedText !== undefined && {
        highlightedText: normalizeText(req.body.highlightedText),
      }),
      ...(req.body.description !== undefined && {
        description: normalizeText(req.body.description),
      }),
    });

    return res.status(201).json({
      success: true,
      message: "FAQ header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/dashboard/faq/header/:id
 * Updates the FAQ header by ID.
 */
async function updateFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ header id",
      });
    }

    const existing = await FaqHeader.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "FAQ header not found",
      });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }
    if (req.body.highlightedText !== undefined) {
      updatePayload.highlightedText = normalizeText(req.body.highlightedText);
    }
    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }

    const updated = await FaqHeader.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "FAQ header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update FAQ Header Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/dashboard/faq/header/:id
 * Deletes the FAQ header by ID.
 */
async function deleteFaqHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ header id",
      });
    }

    const header = await FaqHeader.findByIdAndDelete(id);
    if (!header) {
      return res.status(404).json({
        success: false,
        message: "FAQ header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete FAQ Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getFaqHeader,
  createFaqHeader,
  updateFaqHeader,
  deleteFaqHeader,
};
