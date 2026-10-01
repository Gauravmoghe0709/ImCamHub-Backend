const { isValidObjectId } = require("mongoose");
const SponsorBusinessCard = require("../../model/SponsorBusinessmodel/SponsorBusinessCard");

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_CARDS = 6;

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

const getErrorResponse = (error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return { status: 400, message: "Invalid Caseworker Portal Card data" };
  }
  return { status: 500, message: "Something went wrong" };
};

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /caseworker-portal/cards
 * Returns only active cards sorted by displayOrder ASC (public, no auth).
 */
async function getAllSponsorBusinessCards(req, res) {
  try {
    const cards = await SponsorBusinessCard.find({ isActive: true }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Get Public Caseworker Portal Cards Error:", error);
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
 * GET /admin/caseworker-portal/cards
 * Returns all cards (active + inactive) sorted by displayOrder ASC.
 */
async function adminGetAllSponsorBusinessCards(req, res) {
  try {
    const cards = await SponsorBusinessCard.find().sort({ displayOrder: 1 });

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal cards fetched successfully",
      data: cards,
    });
  } catch (error) {
    console.error("Admin Get All Caseworker Portal Cards Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * GET /admin/caseworker-portal/cards/:id
 * Returns a single card by ID.
 */
async function getSponsorBusinessCardById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal Card id",
      });
    }

    const card = await SponsorBusinessCard.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal Card fetched successfully",
      data: card,
    });
  } catch (error) {
    console.error("Get Caseworker Portal Card By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**
 * POST /admin/caseworker-portal/cards
 * Creates a new card — enforces a strict maximum of 6.
 * Does NOT affect Header — completely independent.
 */
async function createSponsorBusinessCard(req, res) {
  try {
    // Validate required fields
    const requiredTextFields = ["title", "description"];
    for (const field of requiredTextFields) {
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

    if (req.body.displayOrder === undefined || req.body.displayOrder === null) {
      return res.status(400).json({
        success: false,
        message: "displayOrder is required",
      });
    }

    if (!Number.isInteger(Number(req.body.displayOrder))) {
      return res.status(400).json({
        success: false,
        message: "displayOrder must be an integer",
      });
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

    // Enforce 6-card limit — counts ALL cards (active + inactive)
    const totalCards = await SponsorBusinessCard.countDocuments();
    if (totalCards >= MAX_CARDS) {
      return res.status(409).json({
        success: false,
        message: "Maximum 6 cards are allowed.",
      });
    }

    const card = await SponsorBusinessCard.create({
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
      displayOrder: Number(req.body.displayOrder),
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Caseworker Portal Card created successfully",
      data: card,
    });
  } catch (error) {
    console.error("Create Caseworker Portal Card Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/caseworker-portal/cards/:id
 * Updates an existing card — the 6-card limit does NOT apply to updates.
 * Does NOT affect Header — completely independent.
 */
async function updateSponsorBusinessCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal Card id",
      });
    }

    const existing = await SponsorBusinessCard.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal Card not found",
      });
    }

    const updatePayload = {};

    ["title", "description"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    if (req.body.displayOrder !== undefined) {
      if (!Number.isInteger(Number(req.body.displayOrder))) {
        return res.status(400).json({
          success: false,
          message: "displayOrder must be an integer",
        });
      }
      updatePayload.displayOrder = Number(req.body.displayOrder);
    }

    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    const updated = await SponsorBusinessCard.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal Card updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Caseworker Portal Card Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/caseworker-portal/cards/:id
 * Deletes a card by ID.
 * Does NOT affect Header — completely independent.
 */
async function deleteSponsorBusinessCard(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Caseworker Portal Card id",
      });
    }

    const card = await SponsorBusinessCard.findByIdAndDelete(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Caseworker Portal Card not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Caseworker Portal Card deleted successfully",
      data: card,
    });
  } catch (error) {
    console.error("Delete Caseworker Portal Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  getAllSponsorBusinessCards,
  adminGetAllSponsorBusinessCards,
  getSponsorBusinessCardById,
  createSponsorBusinessCard,
  updateSponsorBusinessCard,
  deleteSponsorBusinessCard,
};
