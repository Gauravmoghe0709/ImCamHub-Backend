const { isValidObjectId } = require("mongoose");
const FooterContact = require("../../model/Footer/FooterContact");

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
    return { status: 400, message: "Invalid footer contact data" };
  }
  return { status: 500, message: "Something went wrong" };
};

const isValidEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const parseLinks = (raw) =>
  typeof raw === "string" ? JSON.parse(raw) : raw;

const validateSocialLinks = (links) => {
  if (!Array.isArray(links)) return "socialLinks must be an array";
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (typeof link.platform !== "string" || !link.platform.trim())
      return `socialLinks[${i}].platform is required and must be a non-empty string`;
    if (typeof link.url !== "string" || !link.url.trim())
      return `socialLinks[${i}].url is required and must be a non-empty string`;
    if (!Number.isInteger(Number(link.displayOrder)))
      return `socialLinks[${i}].displayOrder must be an integer`;
  }
  return null;
};

const normalizeSocialLinks = (links) =>
  links.map((l) => ({
    platform: String(l.platform).trim(),
    url: String(l.url).trim(),
    displayOrder: Number(l.displayOrder),
  }));

// ---------------------------------------------------------------------------
// Public controller
// ---------------------------------------------------------------------------

/**
 * GET /footer/contact
 * Returns the active footer contact section (public, no auth).
 * socialLinks sorted by displayOrder ASC.
 */
async function getPublicFooterContact(req, res) {
  try {
    const contact = await FooterContact.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "No active footer contact section found",
      });
    }

    const data = contact.toObject();
    data.socialLinks = (data.socialLinks || []).sort(
      (a, b) => a.displayOrder - b.displayOrder
    );

    return res.status(200).json({
      success: true,
      message: "Footer contact section fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Public Footer Contact Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

// ---------------------------------------------------------------------------
// Admin controllers
// ---------------------------------------------------------------------------

/**
 * GET /admin/footer/contact
 * Returns all footer contact records (active + inactive).
 */
async function getFooterContact(req, res) {
  try {
    const contacts = await FooterContact.find().sort({ createdAt: -1 });

    const data = contacts.map((c) => {
      const obj = c.toObject();
      obj.socialLinks = (obj.socialLinks || []).sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      return obj;
    });

    return res.status(200).json({
      success: true,
      message: "Footer contact section fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get Footer Contact Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

/**
 * POST /admin/footer/contact
 * Creates a new footer contact record.
 */
async function createFooterContact(req, res) {
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

    // Validate optional email
    if (req.body.email !== undefined && req.body.email !== "" &&
        !isValidEmail(req.body.email)) {
      return res
        .status(400)
        .json({ success: false, message: "email must be a valid email address" });
    }

    let socialLinks = [];
    if (req.body.socialLinks !== undefined) {
      const linksData = parseLinks(req.body.socialLinks);
      const linkError = validateSocialLinks(linksData);
      if (linkError)
        return res.status(400).json({ success: false, message: linkError });
      socialLinks = normalizeSocialLinks(linksData);
    }

    const contact = await FooterContact.create({
      sectionTitle: normalizeText(req.body.sectionTitle),
      ...(req.body.email !== undefined && req.body.email !== "" && {
        email: req.body.email.trim().toLowerCase(),
      }),
      ...(req.body.phone !== undefined && {
        phone: normalizeText(req.body.phone),
      }),
      ...(req.body.website !== undefined && {
        website: normalizeText(req.body.website),
      }),
      ...(req.body.address !== undefined && {
        address: normalizeText(req.body.address),
      }),
      socialLinks,
      isActive: parseBoolean(req.body.isActive),
    });

    return res.status(201).json({
      success: true,
      message: "Footer contact section created successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Create Footer Contact Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * PUT /admin/footer/contact/:id
 * Updates an existing footer contact record.
 */
async function updateFooterContact(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid footer contact id" });
    }

    const existing = await FooterContact.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Footer contact section not found" });
    }

    const updatePayload = {};

    if (req.body.sectionTitle !== undefined) {
      updatePayload.sectionTitle = normalizeText(req.body.sectionTitle);
    }
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = parseBoolean(req.body.isActive);
    }

    if (req.body.email !== undefined) {
      if (req.body.email !== "" && !isValidEmail(req.body.email)) {
        return res.status(400).json({
          success: false,
          message: "email must be a valid email address",
        });
      }
      updatePayload.email = req.body.email.trim().toLowerCase();
    }

    ["phone", "website", "address"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    if (req.body.socialLinks !== undefined) {
      const linksData = parseLinks(req.body.socialLinks);
      const linkError = validateSocialLinks(linksData);
      if (linkError)
        return res.status(400).json({ success: false, message: linkError });
      updatePayload.socialLinks = normalizeSocialLinks(linksData);
    }

    const updated = await FooterContact.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Footer contact section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Footer Contact Error:", error);
    const response = getErrorResponse(error);
    return res
      .status(response.status)
      .json({ success: false, message: response.message });
  }
}

/**
 * DELETE /admin/footer/contact/:id
 * Deletes a footer contact record by ID.
 */
async function deleteFooterContact(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid footer contact id" });
    }

    const contact = await FooterContact.findByIdAndDelete(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Footer contact section not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Footer contact section deleted successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Delete Footer Contact Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  getPublicFooterContact,
  getFooterContact,
  createFooterContact,
  updateFooterContact,
  deleteFooterContact,
};
