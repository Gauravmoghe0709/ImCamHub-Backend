const { isValidObjectId } = require("mongoose");
const HowItWorksProcess = require("../../model/SolutionsPage model/HowItWorksProcess");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_PROCESSES = 3;
const VALID_STEP_NUMBERS = ["01", "02", "03"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : value;

const parseNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? value : parsed;
  }
  return value;
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /how-it-works/process
 * Returns all active How It Works Processes sorted by displayOrder ASC (public, no auth required).
 */
async function getHowItWorksProcesses(req, res) {
  try {
    const processes = await HowItWorksProcess.find({ is_active: true }).sort({
      display_order: 1,
    });

    return res.status(200).json({
      success: true,
      data: processes,
    });
  } catch (error) {
    console.error("Get How It Works Processes Error:", error);
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
 * POST /admin/how-it-works/process
 * Creates a new How It Works Process record.
 * ENFORCES MAXIMUM 3 PROCESSES LIMIT.
 * PREVENTS DUPLICATE STEP NUMBERS.
 */
async function createHowItWorksProcess(req, res) {
  try {
    // Check 3-process limit BEFORE validating other fields
    const processCount = await HowItWorksProcess.countDocuments();
    if (processCount >= MAX_PROCESSES) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 process steps are allowed.",
      });
    }

    // Validate required fields
    const { title, description, step_number, display_order, is_active } = req.body;

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

    if (step_number === undefined || step_number === null) {
      return res.status(400).json({
        success: false,
        message: "step_number is required",
      });
    }

    // Validate step_number is one of 01, 02, 03
    const normalizedStepNumber = String(step_number).trim();
    if (!VALID_STEP_NUMBERS.includes(normalizedStepNumber)) {
      return res.status(400).json({
        success: false,
        message: "step_number must be one of: 01, 02, 03",
      });
    }

    // Check for duplicate step_number
    const existingStep = await HowItWorksProcess.findOne({
      step_number: normalizedStepNumber,
    });
    if (existingStep) {
      return res.status(400).json({
        success: false,
        message: `Process with step_number ${normalizedStepNumber} already exists`,
      });
    }

    if (
      display_order === undefined ||
      display_order === null ||
      display_order === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "display_order is required",
      });
    }

    const parsedDisplayOrder = parseNumber(display_order);
    if (typeof parsedDisplayOrder !== "number" || isNaN(parsedDisplayOrder)) {
      return res.status(400).json({
        success: false,
        message: "display_order must be a valid number",
      });
    }

    const process = await HowItWorksProcess.create({
      title: normalizeText(title),
      description: normalizeText(description),
      step_number: normalizedStepNumber,
      display_order: parsedDisplayOrder,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    });

    return res.status(201).json({
      success: true,
      message: "How It Works Process created successfully",
      data: process,
    });
  } catch (error) {
    console.error("Create How It Works Process Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/how-it-works/process
 * Returns all How It Works Processes (active + inactive) sorted by displayOrder ASC.
 */
async function getAdminHowItWorksProcesses(req, res) {
  try {
    const processes = await HowItWorksProcess.find().sort({
      display_order: 1,
    });

    return res.status(200).json({
      success: true,
      data: processes,
    });
  } catch (error) {
    console.error("Get Admin How It Works Processes Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/how-it-works/process/:id
 * Returns a single How It Works Process by ID.
 */
async function getHowItWorksProcessById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid How It Works Process id",
      });
    }

    const process = await HowItWorksProcess.findById(id);

    if (!process) {
      return res.status(404).json({
        success: false,
        message: "How It Works Process not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: process,
    });
  } catch (error) {
    console.error("Get How It Works Process By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/how-it-works/process/:id
 * Updates an existing How It Works Process by ID.
 * IMPORTANT: Updating an existing process works even when 3 processes already exist.
 * The 3-process limit only applies to CREATE operations.
 * Does NOT allow changing step_number to a value that already exists.
 */
async function updateHowItWorksProcess(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid How It Works Process id",
      });
    }

    const existing = await HowItWorksProcess.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "How It Works Process not found",
      });
    }

    const updatePayload = {};

    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
    }

    // Handle step_number update with duplicate check
    if (req.body.step_number !== undefined) {
      const normalizedStepNumber = String(req.body.step_number).trim();

      // Validate it's one of the allowed values
      if (!VALID_STEP_NUMBERS.includes(normalizedStepNumber)) {
        return res.status(400).json({
          success: false,
          message: "step_number must be one of: 01, 02, 03",
        });
      }

      // Check for duplicate step_number (excluding current record)
      const duplicateStep = await HowItWorksProcess.findOne({
        step_number: normalizedStepNumber,
        _id: { $ne: id },
      });
      if (duplicateStep) {
        return res.status(400).json({
          success: false,
          message: `Process with step_number ${normalizedStepNumber} already exists`,
        });
      }

      updatePayload.step_number = normalizedStepNumber;
    }

    if (req.body.display_order !== undefined) {
      const parsedDisplayOrder = parseNumber(req.body.display_order);
      if (
        typeof parsedDisplayOrder !== "number" ||
        isNaN(parsedDisplayOrder)
      ) {
        return res.status(400).json({
          success: false,
          message: "display_order must be a valid number",
        });
      }
      updatePayload.display_order = parsedDisplayOrder;
    }

    if (req.body.is_active !== undefined) {
      updatePayload.is_active = Boolean(req.body.is_active);
    }

    const updated = await HowItWorksProcess.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "How It Works Process updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update How It Works Process Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/how-it-works/process/:id
 * Deletes a How It Works Process by ID.
 * After deletion, total count decreases and a new process can be created.
 */
async function deleteHowItWorksProcess(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid How It Works Process id",
      });
    }

    const process = await HowItWorksProcess.findByIdAndDelete(id);

    if (!process) {
      return res.status(404).json({
        success: false,
        message: "How It Works Process not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "How It Works Process deleted successfully",
      data: process,
    });
  } catch (error) {
    console.error("Delete How It Works Process Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getHowItWorksProcesses,
  createHowItWorksProcess,
  getAdminHowItWorksProcesses,
  getHowItWorksProcessById,
  updateHowItWorksProcess,
  deleteHowItWorksProcess,
};
