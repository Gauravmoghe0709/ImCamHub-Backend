const { isValidObjectId } = require("mongoose");
const OurSolutionsCards = require("../../model/SolutionsPage model/OurSolutionsCards");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_CARDS = 8;

// ---------------------------------------------------------------------------
// Helpers
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
 * GET /solutions/cards
 * Returns all active Our Solutions Cards sorted by displayOrder ASC (public, no auth required).
 */
async function getOurSolutionsCards(req, res) {
  try {
    const cards = await OurSolutionsCards.find({ is_active: true }).sort({
      display_order: 1,
    });

    return res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error("Get Our Solutions Cards Error:", error);
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
 * POST /admin/solutions/cards
 * Creates a new Our Solutions Card record.
 * ENFORCES MAXIMUM 8 CARDS LIMIT.
 */
async function createOurSolutionsCard(req, res) {
  try {
    // Check 8-card limit BEFORE validating other fields
    const cardCount = await OurSolutionsCards.countDocuments();
    if (cardCount >= MAX_CARDS) {
      return res.status(400).json({
        success: false,
        message: "Maximum 8 Our Solutions cards are allowed.",
      });
    }

    // Validate required fields
    const { title, description, display_order, is_active } = req.body;

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

    const card = await OurSolutionsCards.create({
      title: normalizeText(title),
      description: normalizeText(description),
      display_order: parsedDisplayOrder,
      is_active: is_active !== undefined ? parseBoolean(is_active) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Our Solutions Card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Our Solutions Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions/cards
 * Returns all Our Solutions Cards (active + inactive) sorted by displayOrder ASC.
 */
async function getAllOurSolutionsCards(req, res) {
  try {
    const cards = await OurSolutionsCards.find().sort({ display_order: 1 });

    return res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error("Get All Our Solutions Cards Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/solutions/cards/:id
 * Returns a single Our Solutions Card by ID.
 */
async function getOurSolutionsCardById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Card id",
      });
    }

    const card = await OurSolutionsCards.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    console.error("Get Our Solutions Card By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PUT /admin/solutions/cards/:id
 * Updates an existing Our Solutions Card by ID.
 * IMPORTANT: Updating an existing card works even when 8 cards already exist.
 * The 8-card limit only applies to CREATE operations.
 */
async function updateOurSolutionsCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Card id",
      });
    }

    const existing = await OurSolutionsCards.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Card not found",
      });
    }

    const updatePayload = {};

    if (req.body.title !== undefined) {
      updatePayload.title = normalizeText(req.body.title);
    }

    if (req.body.description !== undefined) {
      updatePayload.description = normalizeText(req.body.description);
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
      updatePayload.is_active = parseBoolean(req.body.is_active);
    }

    const updated = await OurSolutionsCards.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Our Solutions Card updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Our Solutions Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * DELETE /admin/solutions/cards/:id
 * Deletes an Our Solutions Card by ID.
 * After deletion, total count decreases and a new card can be created.
 */
async function deleteOurSolutionsCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Card id",
      });
    }

    const card = await OurSolutionsCards.findByIdAndDelete(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Our Solutions Card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Our Solutions Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * PATCH /admin/solutions/cards/:id/status
 * Toggles the active/inactive status of an Our Solutions Card.
 */
async function toggleOurSolutionsCardStatus(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Our Solutions Card id",
      });
    }

    const { is_active } = req.body;

    if (is_active === undefined || is_active === null || is_active === "") {
      return res.status(400).json({
        success: false,
        message: "is_active is required",
      });
    }

    const card = await OurSolutionsCards.findByIdAndUpdate(
      id,
      { is_active: parseBoolean(is_active) },
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Our Solutions Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Our Solutions Card status updated successfully",
      data: card,
    });
  } catch (error) {
    console.error("Toggle Our Solutions Card Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getOurSolutionsCards,
  createOurSolutionsCard,
  getAllOurSolutionsCards,
  getOurSolutionsCardById,
  updateOurSolutionsCard,
  deleteOurSolutionsCard,
  toggleOurSolutionsCardStatus,
};
