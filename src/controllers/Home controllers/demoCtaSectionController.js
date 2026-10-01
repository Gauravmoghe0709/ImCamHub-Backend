const { isValidObjectId } = require("mongoose");
const DemoCtaSection = require("../../model/Homepage/demoCtaSection");
const uploadImage = require("../../services/Storage.services");

// ---------------------------------------------------------------------------
// Helpers — identical pattern to PlatformSection.controller.js
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return value;
};

/**
 * Uploads req.file to ImageKit using the existing uploadImage service.
 * Folder convention follows the project: imcamhub/homepage/<section>
 */
const uploadBackgroundImage = async (req) => {
  if (!req.file) {
    throw new Error("backgroundImage file is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "demo-cta-background",
    "imcamhub/homepage/democta"
  );

  return response?.url;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /demo-cta
 * Returns the active Demo CTA section (public).
 */
async function getPublicDemoCta(req, res) {
  try {
    const section = await DemoCtaSection.findOne({ isActive: true }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "No active demo CTA section found",
      });
    }

    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error("Get Public Demo CTA Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/demo-cta
 * Returns all Demo CTA sections regardless of isActive status.
 */
async function adminGetDemoCtaSections(req, res) {
  try {
    const sections = await DemoCtaSection.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Demo CTA sections fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Admin Get Demo CTA Sections Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/demo-cta
 * Creates a new Demo CTA section.
 * Accepts multipart/form-data — backgroundImage handled by existing Multer middleware.
 */
async function createDemoCtaSection(req, res) {
  try {
    // Validate required text fields
    const requiredFields = ["heading", "description", "ctaButton", "ctaLink"];
    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        !String(req.body[field]).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (
      req.body.isActive === undefined ||
      req.body.isActive === null ||
      req.body.isActive === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    // Upload background image if provided
    let backgroundImageUrl = undefined;
    if (req.file) {
      try {
        backgroundImageUrl = await uploadBackgroundImage(req);
      } catch (uploadError) {
        console.error("Demo CTA Background Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Background image upload failed. Please try again.",
        });
      }
    }

    const section = await DemoCtaSection.create({
      heading: normalizeText(req.body.heading),
      highlightedText: req.body.highlightedText
        ? normalizeText(req.body.highlightedText)
        : undefined,
      description: normalizeText(req.body.description),
      ctaButton: normalizeText(req.body.ctaButton),
      ctaLink: normalizeText(req.body.ctaLink),
      ...(backgroundImageUrl && { backgroundImage: backgroundImageUrl }),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Demo CTA section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create Demo CTA Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * PUT /admin/demo-cta/:id
 * Updates an existing Demo CTA section.
 * If a new backgroundImage file is uploaded, it replaces the old URL.
 * If no file is uploaded, the existing backgroundImage is preserved.
 */
async function updateDemoCtaSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid demo CTA section id",
      });
    }

    const existingSection = await DemoCtaSection.findById(id);
    if (!existingSection) {
      return res.status(404).json({
        success: false,
        message: "Demo CTA section not found",
      });
    }

    const updatePayload = {};

    // Update text fields only when provided
    const textFields = [
      "heading",
      "highlightedText",
      "description",
      "ctaButton",
      "ctaLink",
    ];
    for (const field of textFields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    }

    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    // Handle background image upload — only when a new file is supplied
    if (req.file) {
      try {
        const newUrl = await uploadBackgroundImage(req);
        updatePayload.backgroundImage = newUrl;
      } catch (uploadError) {
        console.error("Demo CTA Background Image Upload Error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Background image upload failed. The existing image was not changed.",
        });
      }
    }
    // If no file was supplied, backgroundImage is NOT added to updatePayload
    // so the existing value remains untouched in the database.

    const updatedSection = await DemoCtaSection.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Demo CTA section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Update Demo CTA Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * DELETE /admin/demo-cta/:id
 * Deletes a Demo CTA section by ID.
 */
async function deleteDemoCtaSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid demo CTA section id",
      });
    }

    const section = await DemoCtaSection.findByIdAndDelete(id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Demo CTA section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Demo CTA section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.error("Delete Demo CTA Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getPublicDemoCta,
  adminGetDemoCtaSections,
  createDemoCtaSection,
  updateDemoCtaSection,
  deleteDemoCtaSection,
};
