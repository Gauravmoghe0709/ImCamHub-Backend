const { isValidObjectId } = require("mongoose");
const heroSection = require("../../model/Homepage/heroSection.model");
const uploadImage = require("../../services/Storage.services");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }

  return value;
};

const sanitizeSection = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    heading: record.heading || "",
    description: record.description || "",
    heroImage: record.heroImage || "",
    primaryButtonText: record.primaryButtonText || "",
    primaryButtonLink: record.primaryButtonLink || "",
    secondaryButtonText: record.secondaryButtonText || "",
    secondaryButtonLink: record.secondaryButtonLink || "",
    isActive: Boolean(record.isActive),
  };
};

const uploadMedia = async (req, fieldName, folder) => {
  const fileArray = req.files?.[fieldName];
  if (!fileArray || fileArray.length === 0) {
    return null;
  }

  const file = fileArray[0];

  // Validate image size for dashboardImage (5MB limit)
  if (fieldName === "dashboardImage" && file.size > 5 * 1024 * 1024) {
    throw new Error("Hero image must be 5 MB or smaller");
  }

  // Validate video size for heroVideo (50MB limit)
  if (fieldName === "heroVideo" && file.size > 50 * 1024 * 1024) {
    throw new Error("Hero video must be 50 MB or smaller");
  }

  const response = await uploadImage(
    file.buffer,
    file.originalname || `herosection-${fieldName}`,
    folder
  );

  return response?.url;
};

const validateRequiredTextFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || !String(payload[field]).trim()) {
      return field;
    }
  }

  return null;
};

async function createheroSection(req, res) {
  try {
    const requiredFields = [
      "primaryButtonText",
      "primaryButtonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
    ];

    const missingField = validateRequiredTextFields(req.body, requiredFields);
    if (req.body.isActive === undefined || req.body.isActive === null || req.body.isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Upload image (optional)
    let uploadedImageUrl = null;
    try {
      uploadedImageUrl = await uploadMedia(req, "dashboardImage", "imcamhub/homepage/herosection");
    } catch (imageError) {
      return res.status(400).json({
        success: false,
        message: imageError.message,
      });
    }

    // Upload video if provided (optional)
    let uploadedVideoUrl = null;
    try {
      uploadedVideoUrl = await uploadMedia(req, "heroVideo", "imcamhub/homepage/herosection/videos");
    } catch (videoError) {
      return res.status(400).json({
        success: false,
        message: videoError.message,
      });
    }

    const newHeroSection = await heroSection.create({
      heading: normalizeText(req.body.heading) || "",
      description: normalizeText(req.body.description) || "",
      dashboardImage: uploadedImageUrl || null,
      heroVideo: uploadedVideoUrl || null,
      primaryButtonText: normalizeText(req.body.primaryButtonText),
      primaryButtonLink: normalizeText(req.body.primaryButtonLink),
      secondaryButtonText: normalizeText(req.body.secondaryButtonText),
      secondaryButtonLink: normalizeText(req.body.secondaryButtonLink),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "hero section created successfully",
      data: newHeroSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getAllheroSections(req, res) {
  try {
    const heroSections = await heroSection.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "hero sections fetched successfully",
      data: heroSections,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getheroSectionById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero section id",
      });
    }

    const heroSectionRecord = await heroSection.findById(id);

    if (!heroSectionRecord) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "hero section fetched successfully",
      data: heroSectionRecord,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function updateheroSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero section id",
      });
    }

    const existingSection = await heroSection.findById(id);

    if (!existingSection) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    const updatePayload = {};

    [
      "heading",
      "description",
      "primaryButtonText",
      "primaryButtonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
      "isActive",
    ].forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "isActive") {
          updatePayload[field] = parseBoolean(req.body[field]);
          return;
        }

        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Handle image update if new image provided
    if (req.files?.dashboardImage && req.files.dashboardImage.length > 0) {
      try {
        const uploadedImageUrl = await uploadMedia(req, "dashboardImage", "imcamhub/homepage/herosection");
        updatePayload.dashboardImage = uploadedImageUrl;
      } catch (imageError) {
        return res.status(400).json({
          success: false,
          message: imageError.message,
        });
      }
    }

    // Handle video update if new video provided
    if (req.files?.heroVideo && req.files.heroVideo.length > 0) {
      try {
        const uploadedVideoUrl = await uploadMedia(req, "heroVideo", "imcamhub/homepage/herosection/videos");
        updatePayload.heroVideo = uploadedVideoUrl;
      } catch (videoError) {
        return res.status(400).json({
          success: false,
          message: videoError.message,
        });
      }
    }

    const updatedSection = await heroSection.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "hero section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function deleteheroSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero section id",
      });
    }

    const heroSectionRecord = await heroSection.findByIdAndDelete(id);

    if (!heroSectionRecord) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "hero section deleted successfully",
      data: heroSectionRecord,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function toggleheroSectionStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hero section id",
      });
    }

    const { isActive } = req.body;

    if (isActive === undefined || isActive === null || isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    const heroSectionRecord = await heroSection.findByIdAndUpdate(
      id,
      { isActive: parseBoolean(isActive) },
      { new: true }
    );

    if (!heroSectionRecord) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "hero section status updated successfully",
      data: heroSectionRecord,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getActiveheroSection(req, res) {
  try {
    const heroSectionRecord = await heroSection.findOne({ isActive: true }).sort({ updatedAt: -1, createdAt: -1 });

    if (!heroSectionRecord) {
      return res.status(404).json({
        success: false,
        message: "No active hero section found",
      });
    }

    return res.status(200).json({
      success: true,
      data: heroSectionRecord,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  createheroSection,
  getAllheroSections,
  getheroSectionById,
  updateheroSection,
  deleteheroSection,
  toggleheroSectionStatus,
  getActiveheroSection,
};
