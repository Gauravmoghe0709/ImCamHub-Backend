const { isValidObjectId } = require("mongoose");
const ProblemSolutionSection = require("../../model/Homepage/problemSolutionSection.model");

const requiredTextFields = ["title", "highlightedTitle", "description"];
const optionalTextFields = ["badgeText"];

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(normalized)) return true;
    if (["false", "0", "no", "n"].includes(normalized)) return false;
  }
  return undefined;
};

const validatePayload = (payload, requireAllFields = false) => {
  // Validate required fields
  if (requireAllFields) {
    for (const field of requiredTextFields) {
      if (typeof payload[field] !== "string" || !payload[field].trim()) {
        return `${field} is required`;
      }
    }
  } else {
    for (const field of requiredTextFields) {
      if (payload[field] !== undefined &&
          (typeof payload[field] !== "string" || !payload[field].trim())) {
        return `${field} must be a non-empty string`;
      }
    }
  }

  // Validate optional fields (if provided, must be valid)
  for (const field of optionalTextFields) {
    if (payload[field] !== undefined &&
        (typeof payload[field] !== "string")) {
      return `${field} must be a string`;
    }
  }

  if (payload.isActive !== undefined && parseBoolean(payload.isActive) === undefined) {
    return "isActive must be a boolean";
  }

  if (
    payload.displayOrder !== undefined &&
    (typeof payload.displayOrder !== "number" || !Number.isFinite(payload.displayOrder))
  ) {
    return "displayOrder must be a number";
  }

  return null;
};

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid problem solution section data" };
  }
  return { status: 500, message: "Something went wrong" };
};

async function createProblemSolutionSection(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const section = await ProblemSolutionSection.create({
      badgeText: req.body.badgeText ? req.body.badgeText.trim() : "",
      title: req.body.title.trim(),
      highlightedTitle: req.body.highlightedTitle.trim(),
      description: req.body.description.trim(),
      ...(req.body.isActive !== undefined && { isActive: parseBoolean(req.body.isActive) }),
      ...(req.body.displayOrder !== undefined && { displayOrder: req.body.displayOrder }),
    });

    return res.status(201).json({
      success: true,
      message: "Problem solution section created successfully",
      data: section,
    });
  } catch (error) {
    console.error("Create Problem Solution Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

async function getAllProblemSolutionSections(req, res) {
  try {
    const sections = await ProblemSolutionSection.find().sort({ displayOrder: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "Problem solution sections fetched successfully",
      data: sections,
    });
  } catch (error) {
    console.error("Get Problem Solution Sections Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function getProblemSolutionSectionById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution section id" });
    }

    const section = await ProblemSolutionSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Problem solution section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution section fetched successfully",
      data: section,
    });
  } catch (error) {
    console.error("Get Problem Solution Section By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function updateProblemSolutionSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution section id" });
    }

    const validationError = validatePayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const updatePayload = {};
    for (const field of requiredTextFields) {
      if (req.body[field] !== undefined) updatePayload[field] = req.body[field].trim();
    }
    for (const field of optionalTextFields) {
      if (req.body[field] !== undefined) updatePayload[field] = req.body[field] ? req.body[field].trim() : "";
    }
    if (req.body.isActive !== undefined) updatePayload.isActive = parseBoolean(req.body.isActive);
    if (req.body.displayOrder !== undefined) updatePayload.displayOrder = req.body.displayOrder;

    const section = await ProblemSolutionSection.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });
    if (!section) {
      return res.status(404).json({ success: false, message: "Problem solution section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution section updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Update Problem Solution Section Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

async function deleteProblemSolutionSection(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution section id" });
    }

    const section = await ProblemSolutionSection.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Problem solution section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution section deleted successfully",
      data: section,
    });
  } catch (error) {
    console.error("Delete Problem Solution Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function toggleProblemSolutionSectionStatus(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution section id" });
    }

    const isActive = parseBoolean(req.body.isActive);
    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: "isActive must be a boolean" });
    }

    const section = await ProblemSolutionSection.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );
    if (!section) {
      return res.status(404).json({ success: false, message: "Problem solution section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution section status updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Toggle Problem Solution Section Status Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function getActiveProblemSolutionSection(req, res) {
  try {
    const section = await ProblemSolutionSection.findOne({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: 1,
    });
    if (!section) {
      return res.status(404).json({ success: false, message: "No active problem solution section found" });
    }

    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    console.error("Get Public Problem Solution Section Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  createProblemSolutionSection,
  getAllProblemSolutionSections,
  getProblemSolutionSectionById,
  updateProblemSolutionSection,
  deleteProblemSolutionSection,
  toggleProblemSolutionSectionStatus,
  getActiveProblemSolutionSection,
};
