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

const uploadheroImage = async (req) => {
  if (!req.file) {
    throw new Error("heroImage is required");
  }

  const response = await uploadImage(
    req.file.buffer,
    req.file.originalname || "herosection-image",
    "imcamhub/homepage/herosection"
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "heroImage is required",
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

    const uploadedUrl = await uploadheroImage(req);

    const heroSection = await heroSection.create({
      heading: normalizeText(req.body.heading) || "",
      description: normalizeText(req.body.description) || "",
      heroImage: uploadedUrl,
      primaryButtonText: normalizeText(req.body.primaryButtonText),
      primaryButtonLink: normalizeText(req.body.primaryButtonLink),
      secondaryButtonText: normalizeText(req.body.secondaryButtonText),
      secondaryButtonLink: normalizeText(req.body.secondaryButtonLink),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "hero section created successfully",
      data: sanitizeSection(heroSection),
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

    const heroSection = await heroSection.findById(id);

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "hero section fetched successfully",
      data: heroSection,
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

    if (req.file) {
      const uploadedUrl = await uploadheroImage(req);
      updatePayload.heroImage = uploadedUrl;
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

    const heroSection = await heroSection.findByIdAndDelete(id);

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "hero section deleted successfully",
      data: heroSection,
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

    const heroSection = await heroSection.findByIdAndUpdate(
      id,
      { isActive: parseBoolean(isActive) },
      { new: true }
    );

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: "hero section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "hero section status updated successfully",
      data: heroSection,
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
    const heroSection = await heroSection.findOne({ isActive: true }).sort({ updatedAt: -1, createdAt: -1 });

    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: "No active hero section found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeSection(heroSection),
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
