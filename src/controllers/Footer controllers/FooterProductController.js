const { isValidObjectId } = require("mongoose");
const FooterProduct = require("../../model/Footer/FooterProduct");

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
    return { status: 400, message: "Invalid footer product data" };
  }
  return { status: 500, message: "Something went wrong" };
};

/**
 * Validates and normalizes the links array.
 * Returns an error message string on failure, or null on success.
 */
const validateLinks = (links) => {
  if (!Array.isArray(links)) return "links must be an array";
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (typeof link.label !== "string" || !link.label.trim())
      return `links[${i}].label is required and must be a non-empty string`;
    if (typeof link.url !== "string" || !link.url.trim())
      return `links[${i}].url is required and must be a non-empty string`;
    if (!Number.isInteger(Number(link.displayOrder)))
      return `links[${i}].displayOrder must be an integer`;
  }
  return null;
};

const normalizeLinks = (links) =>
  links.map((l) => ({
    label: String(l.label).trim(),
    url: String(l.url).trim(),
    displayOrder: Number(l.displayOrder),
  }));

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /footer/product
 * Returns the active footer product section (public, no auth).
 * Links sorted by displayOrder ASC.
 */
async function getPublicFooterProduct(req, res) {
  try {
    const product = await FooterProduct.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No active footer product section found",
      });
    }

    // Sort links by displayOrder ASC before returning
    const data = product.toObject();
    data.links = (data.links || []).sort((a, b) => a.displayOrder - b.displayOrder);

    return res.status(200).json({
      success: true,
      message: "Footer product section fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Public Footer Product Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/footer/product
 * Returns all footer product records (active + inactive).
 */
async function getFooterProduct(req, res) {
  try {
    const products = await FooterProduct.find().sort({ createdAt: -1 });

    const data = products.map((p) => {
      const obj = p.toObject();
      obj.links = (obj.links || []).sort((a, b) => a.displayOrder - b.displayOrder);
      return obj;
    });

    return res.status(200).json({
      success: true,
      message: "Footer product section fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Footer Product Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/footer/product
 * Creates a new footer product record.
 */
async function createFooterProduct(req, res) {
  try {
    if (
      req.body.sectionTitle === undefined ||
      req.body.sectionTitle === null ||
      !String(req.body.sectionTitle).trim()
    ) {
      return res.status(400).json({ success: false, message: "sectionTitle is required" });
    }

    if (
      req.body.isActive === undefined ||
      req.body.isActive === null ||
      req.body.isActive === ""
    ) {
      return res.status(400).json({ success: false, message: "isActive is required" });
    }

    let links = [];
    if (req.body.links !== undefined) {
      const linksData =
        typeof req.body.links === "string"
          ? JSON.parse(req.body.links)
          : req.body.links;
      const linkError = validateLinks(linksData);
      if (linkError) {
        return res.status(400).json({ success: false, message: linkError });
      }
      links = normalizeLinks(linksData);
    }

    const product = await FooterProduct.create({
      sectionTitle: normalizeText(req.body.sectionTitle),
      links,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Footer product section created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Footer Product Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/footer/product/:id
 * Updates an existing footer product record.
 */
async function updateFooterProduct(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid footer product id" });
    }

    const existing = await FooterProduct.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Footer product section not found" });
    }

    const updatePayload = {};

    if (req.body.sectionTitle !== undefined) {
      updatePayload.sectionTitle = normalizeText(req.body.sectionTitle);
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }
    if (req.body.links !== undefined) {
      const linksData =
        typeof req.body.links === "string"
          ? JSON.parse(req.body.links)
          : req.body.links;
      const linkError = validateLinks(linksData);
      if (linkError) {
        return res.status(400).json({ success: false, message: linkError });
      }
      updatePayload.links = normalizeLinks(linksData);
    }

    const updated = await FooterProduct.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Footer product section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Footer Product Error:", error);
    const response = getErrorResponse(error);
    return res.status(response.status).json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/footer/product/:id
 * Deletes a footer product record by ID.
 */
async function deleteFooterProduct(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid footer product id" });
    }

    const product = await FooterProduct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Footer product section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Footer product section deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Delete Footer Product Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getPublicFooterProduct,
  getFooterProduct,
  createFooterProduct,
  updateFooterProduct,
  deleteFooterProduct,
};
