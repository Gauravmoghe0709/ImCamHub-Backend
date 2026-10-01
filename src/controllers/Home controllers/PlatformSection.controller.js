const { isValidObjectId } = require("mongoose");
const PlatformSection = require("../../model/Homepage/PlatformSection.model");
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

const sanitizePlatformSection = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    heading: record.heading || "",
    highlightedText: record.highlightedText || "",
    description: record.description || "",
    dashboardImage: record.dashboardImage || "",
    isActive: Boolean(record.isActive),
  };
};

const uploadPlatformImage = async (req) => {
  if (!req.file) {
    throw new Error("dashboardImage is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "platform-section-image",
    "imcamhub/homepage/platformsection"
  );

  return response?.url;
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (
      payload[field] === undefined ||
      payload[field] === null ||
      !String(payload[field]).trim()
    ) {
      return field;
    }
  }

  return null;
};

async function createPlatformSection(req, res) {
  try {
    const requiredFields = ["description"];
    const missingField = validateRequiredFields(req.body, requiredFields);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "dashboardImage is required",
      });
    }

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

    const uploadedUrl = await uploadPlatformImage(req);

    const platformSection = await PlatformSection.create({
      heading: normalizeText(req.body.heading) || "",
      highlightedText: normalizeText(req.body.highlightedText) || "",
      description: normalizeText(req.body.description),
      dashboardImage: uploadedUrl,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Platform section created successfully",
      data: sanitizePlatformSection(platformSection),
    });
  } catch (error) {
    console.error("Create Platform Section Error:", error);

    if (error.message === "dashboardImage is required") {
      return res.status(400).json({
        success: false,
        message: "dashboardImage is required",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getPlatformSections(req, res) {
  try {
    const platformSections = await PlatformSection.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Platform sections fetched successfully",
      data: platformSections,
    });
  } catch (error) {
    console.error("Get Platform Sections Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getPlatformSectionById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform section id",
      });
    }

    const platformSection = await PlatformSection.findById(id);

    if (!platformSection) {
      return res.status(404).json({
        success: false,
        message: "Platform section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Platform section fetched successfully",
      data: platformSection,
    });
  } catch (error) {
    console.error("Get Platform Section By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function updatePlatformSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform section id",
      });
    }

    const existingSection = await PlatformSection.findById(id);

    if (!existingSection) {
      return res.status(404).json({
        success: false,
        message: "Platform section not found",
      });
    }

    const updatePayload = {};

    ["heading", "highlightedText", "description", "isActive"].forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "isActive") {
          updatePayload[field] = parseBoolean(req.body[field]);
          return;
        }

        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    if (req.file) {
      const uploadedUrl = await uploadPlatformImage(req);
      updatePayload.dashboardImage = uploadedUrl;
    }

    const updatedSection = await PlatformSection.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Platform section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Update Platform Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function deletePlatformSection(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform section id",
      });
    }

    const platformSection = await PlatformSection.findByIdAndDelete(id);

    if (!platformSection) {
      return res.status(404).json({
        success: false,
        message: "Platform section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Platform section deleted successfully",
      data: platformSection,
    });
  } catch (error) {
    console.error("Delete Platform Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function updatePlatformSectionStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid platform section id",
      });
    }

    const { isActive } = req.body;

    if (isActive === undefined || isActive === null || isActive === "") {
      return res.status(400).json({
        success: false,
        message: "isActive is required",
      });
    }

    const updatedSection = await PlatformSection.findByIdAndUpdate(
      id,
      { isActive: parseBoolean(isActive) },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Platform section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Platform section status updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Update Platform Section Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getPublicPlatformSection(req, res) {
  try {
    const platformSection = await PlatformSection.findOne({ isActive: true }).sort({ updatedAt: -1, createdAt: -1 });

    if (!platformSection) {
      return res.status(404).json({
        success: false,
        message: "Platform section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Platform section fetched successfully",
      data: sanitizePlatformSection(platformSection),
    });
  } catch (error) {
    console.error("Get Public Platform Section Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  createPlatformSection,
  getPlatformSections,
  getPlatformSectionById,
  updatePlatformSection,
  deletePlatformSection,
  updatePlatformSectionStatus,
  getPublicPlatformSection,
};
