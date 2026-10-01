const { isValidObjectId } = require("mongoose");
const ProblemSolutionComparison = require("../../model/Homepage/problemSolutionComparison.model");

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
  for (const field of ["problem", "solution"]) {
    if (requireAllFields && (typeof payload[field] !== "string" || !payload[field].trim())) {
      return `${field} is required`;
    }
    if (!requireAllFields && payload[field] !== undefined &&
        (typeof payload[field] !== "string" || !payload[field].trim())) {
      return `${field} must be a non-empty string`;
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
    return { status: 400, message: "Invalid problem solution comparison data" };
  }
  return { status: 500, message: "Something went wrong" };
};

async function createProblemSolutionComparison(req, res) {
  try {
    const validationError = validatePayload(req.body, true);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const comparison = await ProblemSolutionComparison.create({
      problem: req.body.problem.trim(),
      solution: req.body.solution.trim(),
      ...(req.body.displayOrder !== undefined && { displayOrder: req.body.displayOrder }),
      ...(req.body.isActive !== undefined && { isActive: parseBoolean(req.body.isActive) }),
    });

    return res.status(201).json({
      success: true,
      message: "Problem solution comparison created successfully",
      data: comparison,
    });
  } catch (error) {
    console.error("Create Problem Solution Comparison Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

async function getAllProblemSolutionComparisons(req, res) {
  try {
    const comparisons = await ProblemSolutionComparison.find().sort({ displayOrder: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      message: "Problem solution comparisons fetched successfully",
      data: comparisons,
    });
  } catch (error) {
    console.error("Get Problem Solution Comparisons Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function getProblemSolutionComparisonById(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution comparison id" });
    }

    const comparison = await ProblemSolutionComparison.findById(req.params.id);
    if (!comparison) {
      return res.status(404).json({ success: false, message: "Problem solution comparison not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution comparison fetched successfully",
      data: comparison,
    });
  } catch (error) {
    console.error("Get Problem Solution Comparison By Id Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function updateProblemSolutionComparison(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution comparison id" });
    }

    const validationError = validatePayload(req.body);
    if (validationError) return res.status(400).json({ success: false, message: validationError });

    const updatePayload = {};
    for (const field of ["problem", "solution"]) {
      if (req.body[field] !== undefined) updatePayload[field] = req.body[field].trim();
    }
    if (req.body.displayOrder !== undefined) updatePayload.displayOrder = req.body.displayOrder;
    if (req.body.isActive !== undefined) updatePayload.isActive = parseBoolean(req.body.isActive);

    const comparison = await ProblemSolutionComparison.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );
    if (!comparison) {
      return res.status(404).json({ success: false, message: "Problem solution comparison not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution comparison updated successfully",
      data: comparison,
    });
  } catch (error) {
    console.error("Update Problem Solution Comparison Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

async function deleteProblemSolutionComparison(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution comparison id" });
    }

    const comparison = await ProblemSolutionComparison.findByIdAndDelete(req.params.id);
    if (!comparison) {
      return res.status(404).json({ success: false, message: "Problem solution comparison not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution comparison deleted successfully",
      data: comparison,
    });
  } catch (error) {
    console.error("Delete Problem Solution Comparison Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function toggleProblemSolutionComparisonStatus(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid problem solution comparison id" });
    }

    const isActive = parseBoolean(req.body.isActive);
    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: "isActive must be a boolean" });
    }

    const comparison = await ProblemSolutionComparison.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );
    if (!comparison) {
      return res.status(404).json({ success: false, message: "Problem solution comparison not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem solution comparison status updated successfully",
      data: comparison,
    });
  } catch (error) {
    console.error("Toggle Problem Solution Comparison Status Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function getActiveProblemSolutionComparisons(req, res) {
  try {
    const comparisons = await ProblemSolutionComparison.find({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: 1,
    });
    return res.status(200).json({
      success: true,
      message: "Active problem solution comparisons fetched successfully",
      data: comparisons,
    });
  } catch (error) {
    console.error("Get Public Problem Solution Comparisons Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  createProblemSolutionComparison,
  getAllProblemSolutionComparisons,
  getProblemSolutionComparisonById,
  updateProblemSolutionComparison,
  deleteProblemSolutionComparison,
  toggleProblemSolutionComparisonStatus,
  getActiveProblemSolutionComparisons,
};
