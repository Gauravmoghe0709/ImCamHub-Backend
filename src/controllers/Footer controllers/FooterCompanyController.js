const { isValidObjectId } = require("mongoose");
const FooterCompany = require("../../model/Footer/FooterCompany");

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
    return { status: 400, message: "Invalid footer company data" };
  }
  return { status: 500, message: "Something went wrong" };
};

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

const parseLinks = (raw) =>
  typeof raw === "string" ? JSON.parse(raw) : raw;

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /footer/company
 * Returns the active footer company section (public, no auth).
 * Links sorted by displayOrder ASC.
 */
async function getPublicFooterCompany(req, res) {
  try {
    const company = await FooterCompany.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "No active footer company section found",
      });
    }

    const data = company.toObject();
    data.links = (data.links || []).sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    return res.status(200).json({
      success: true,
      message: "Footer company section fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Public Footer Company Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/footer/company
 * Returns all footer company records (active + inactive).
 */
async function getFooterCompany(req, res) {
  try {
    const companies = await FooterCompany.find().sort({ createdAt: -1 });

    const data = companies.map((c) => {
      const obj = c.toObject();
      obj.links = (obj.links || []).sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      return obj;
    });

    return res.status(200).json({
      success: true,
      message: "Footer company section fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Footer Company Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/footer/company
 * Creates a new footer company record.
 */
async function createFooterCompany(req, res) {
  try {
    if (
      req.body.sectionTitle === undefined ||
      req.body.sectionTitle === null ||
      !String(req.body.sectionTitle).trim()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "sectionTitle is required" });
    }

    if (
      req.body.isActive === undefined ||
      req.body.isActive === null ||
      req.body.isActive === ""
    ) {
      return res
        .status(400)
        .json({ success: false, message: "isActive is required" });
    }

    let links = [];
    if (req.body.links !== undefined) {
      const linksData = parseLinks(req.body.links);
      const linkError = validateLinks(linksData);
      if (linkError)
        return res.status(400).json({ success: false, message: linkError });
      links = normalizeLinks(linksData);
    }

    const company = await FooterCompany.create({
      sectionTitle: normalizeText(req.body.sectionTitle),
      links,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Footer company section created successfully",
      data: company,
    });
  } catch (error) {
    console.error("Create Footer Company Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/footer/company/:id
 * Updates an existing footer company record.
 */
async function updateFooterCompany(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid footer company id" });
    }

    const existing = await FooterCompany.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Footer company section not found" });
    }

    const updatePayload = {};

    if (req.body.sectionTitle !== undefined) {
      updatePayload.sectionTitle = normalizeText(req.body.sectionTitle);
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }
    if (req.body.links !== undefined) {
      const linksData = parseLinks(req.body.links);
      const linkError = validateLinks(linksData);
      if (linkError)
        return res.status(400).json({ success: false, message: linkError });
      updatePayload.links = normalizeLinks(linksData);
    }

    const updated = await FooterCompany.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Footer company section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Footer Company Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/footer/company/:id
 * Deletes a footer company record by ID.
 */
async function deleteFooterCompany(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid footer company id" });
    }

    const company = await FooterCompany.findByIdAndDelete(id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Footer company section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Footer company section deleted successfully",
      data: company,
    });
  } catch (error) {
    console.error("Delete Footer Company Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getPublicFooterCompany,
  getFooterCompany,
  createFooterCompany,
  updateFooterCompany,
  deleteFooterCompany,
};
