const { isValidObjectId } = require("mongoose");
const HowItWorksHeader = require("../../model/SolutionsPage model/HowItWorksHeader");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /how-it-works/header
 * Returns the How It Works Header (public, no auth required).
 */
async function getHowItWorksHeader(req, res) {
  try {
    const header = await HowItWorksHeader.findOne();

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "How It Works Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: header,
    });
  } catch (error) {
    console.error("Get How It Works Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * POST /admin/how-it-works/header
 * Creates a new How It Works Header record.
 */
async function createHowItWorksHeader(req, res) {
  try {
    // Validate required fields
    const { title, description } = req.body;

    if (title === undefined || title === null || !String(title).trim()) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    if (
      description === undefined ||
      description === null ||
      !String(description).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "description is required",
      });
    }

    const header = await HowItWorksHeader.create({
      title: normalizeText(title),
      ...(req.body.highlighted_text !== undefined && {
        highlighted_text: normalizeText(req.body.highlighted_text),
      }),
      description: normalizeText(description),
    });

    return res.status(201).json({
      success: true,
      message: "How It Works Header created successfully",
      data: header,
    });
  } catch (error) {
    console.error("Create How It Works Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/how-it-works/header
 * Returns all How It Works Header records.
 */
async function getAdminHowItWorksHeaders(req, res) {
  try {
    const headers = await HowItWorksHeader.find().sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      data: headers,
    });
  } catch (error) {
    console.error("Get Admin How It Works Headers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/how-it-works/header/:id
 * Updates an existing How It Works Header by ID.
 */
async function updateHowItWorksHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid How It Works Header id",
      });
    }

    const existing = await HowItWorksHeader.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "How It Works Header not found",
      });
    }

    const updatePayload = {};

    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }

    if (req.body.highlighted_text !== undefined) {
      updatePayload.highlighted_text = normalizeText(req.body.highlighted_text);
    }

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }

    const updated = await HowItWorksHeader.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "How It Works Header updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update How It Works Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/how-it-works/header/:id
 * Deletes a How It Works Header by ID.
 */
async function deleteHowItWorksHeader(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid How It Works Header id",
      });
    }

    const header = await HowItWorksHeader.findByIdAndDelete(id);

    if (!header) {
      return res.status(404).json({
        success: false,
        message: "How It Works Header not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "How It Works Header deleted successfully",
      data: header,
    });
  } catch (error) {
    console.error("Delete How It Works Header Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getHowItWorksHeader,
  createHowItWorksHeader,
  getAdminHowItWorksHeaders,
  updateHowItWorksHeader,
  deleteHowItWorksHeader,
};
